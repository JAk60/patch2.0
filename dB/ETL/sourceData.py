from datetime import datetime
import logging
from dB.dB_connection import pointer, cnxn, cursor
from flask import Flask, jsonify
from dB.data_manager.data_manager import Data_Manager
import uuid


class ETL():
    def set_for_etl(self, data):
        etl_flag_query = '''
            UPDATE system_configuration
            SET etl = ?
            WHERE ship_name = ? AND nomenclature = ?
        '''

        # Extract data
        ship_name = data['shipName']
        nomenclature = data['nomenclature']
        # Convert True to 1, False to 0
        enabled = 1 if data.get('enabled', False) else 0
        print(ship_name, nomenclature, enabled)

        # Execute the UPDATE query
        cursor.execute(etl_flag_query, (enabled, ship_name, nomenclature))

        # Commit the changes to the database
        cursor.commit()
        return {"code": 1, "message": f"ETL was Successfully enabled for {nomenclature}"}

    def operational_data_etl(self):
        try:
            # First Query: Fetch all equipments where etl is 1
            select_query = '''SELECT component_id,ship_name, nomenclature FROM system_configuration WHERE etl=1'''
            cursor.execute(select_query)
            equipments_data = cursor.fetchall()

            for equipment_data in equipments_data:
                # Extract data from the first query result
                component_id,ship_name, nomenclature = equipment_data
                # Second Query: Fetch data from pointer object using the data points from the first query
                fetch_query = '''
                    SELECT DISTINCT
                        ? as component_id,
                        CONCAT(
                            T_SRARMthlyHeader.SrarYear,
                            '-',
                            RIGHT('00' + CAST(T_SRARMthlyHeader.SrarMonth AS VARCHAR(2)), 2),
                            '-',
                            '01'
                        ) AS operation_date,
                        ISNULL(T_SRARMthlyEquipments.HrsForMonth, 0) AS average_running
                    FROM T_SRARMthlyEquipments WITH (NOLOCK)
                    FULL JOIN T_SRARMthlyHeader WITH (NOLOCK) ON T_SRARMthlyEquipments.Universal_ID_T_SRARMthlyHeader = T_SRARMthlyHeader.Universal_ID_T_SRARMthlyHeader
                    FULL JOIN T_EquipmentShipDetail WITH (NOLOCK) ON T_SRARMthlyEquipments.Universal_ID_T_EquipmentShipDetail = T_EquipmentShipDetail.Universal_ID_T_EquipmentShipDetail
                    FULL JOIN M_Equipment WITH (NOLOCK) ON T_EquipmentShipDetail.Universal_ID_M_Equipment = M_Equipment.Universal_ID_M_Equipment
                    FULL JOIN M_Ship WITH (NOLOCK) ON T_EquipmentShipDetail.Universal_ID_M_Ship = M_Ship.Universal_ID_M_Ship
                    FULL JOIN M_Command WITH (NOLOCK) ON M_Ship.Universal_ID_M_Command = M_Command.Universal_ID_M_Command
                    FULL JOIN M_ShipCategory WITH (NOLOCK) ON M_Ship.Universal_ID_M_ShipCategory = M_ShipCategory.Universal_ID_M_ShipCategory
                    FULL JOIN M_Department WITH (NOLOCK) ON T_EquipmentShipDetail.Universal_ID_M_Department = M_Department.Universal_ID_M_Department
                    WHERE  (T_SRARMthlyHeader.Active = 1 AND T_SRARMthlyEquipments.Active = 1)
                        AND T_SRARMthlyHeader.SrarYear IS NOT NULL
                        AND T_SRARMthlyHeader.SrarMonth IS NOT NULL
                        AND T_SRARMthlyHeader.SrarMonth >= 1 AND T_SRARMthlyHeader.SrarMonth <= 12
                        AND M_Ship.ShipName = ?
                        AND T_EquipmentShipDetail.Nomenclature = ?;
                        '''
                pointer.execute(fetch_query, (component_id, ship_name, nomenclature))
                fetched_data = pointer.fetchall()
                print(fetched_data)
                # fetched_data_dict_list=[{"component_id":row.component_id,"date":row.date}for row in fetched_data]
                # return fetched_data_dict_list
                for data_point in fetched_data:
                    # Extract data from the second query result
                    component_id, operation_date, average_running = data_point
                    
                    # Generate a new UUID for each iteration
                    generated_id = uuid.uuid4()

                    # Third Query: Insert or update data using the merge statements
                    merge_query = """
                        MERGE INTO operational_data AS target
                        USING (VALUES (?, ?, ?, ?)) AS source (id, component_id, operation_date, average_running)
                        ON target.component_id = source.component_id AND target.operation_date = source.operation_date
                        WHEN MATCHED THEN
                            UPDATE SET average_running = ?
                        WHEN NOT MATCHED THEN
                            INSERT (id, component_id, operation_date, average_running)
                            VALUES (?, ?, ?, ?);
                    """

                    cursor.execute(merge_query, (generated_id, component_id, operation_date, average_running,
                                                average_running, generated_id, component_id, operation_date, average_running))
            # Commit changes to the database
            cursor.commit()

            # Return a message if the process is completed
            return "ETL process completed successfully"

        except Exception as e:
            # Return an error message if something went wrong
            return f"Error during ETL process: {str(e)}"

    def overhaul_data_etl(self):
        try:
            # First Query: Fetch all equipments where etl is 1
            select_query = '''SELECT component_id,ship_name, nomenclature FROM system_configuration WHERE etl=1'''
            cursor.execute(select_query)
            equipments_data = cursor.fetchall()

            for equipment_data in equipments_data:
                # Extract data from the first query result
                component_id,ship_name, nomenclature = equipment_data
                # Second Query: Fetch data from pointer object using the data points from the first query
                fetch_query = '''
                    SELECT
                        ? AS component_id,
                        CONVERT(VARCHAR, T_Dart.DefectDate, 23) AS date
                    FROM
                        t_DART WITH (NOLOCK)
                        INNER JOIN T_EquipmentShipDetail (NOLOCK) ON T_Dart.Universal_ID_T_EquipmentShipDetail = T_EquipmentShipDetail.Universal_ID_T_EquipmentShipDetail
                        INNER JOIN M_Ship WITH (NOLOCK) ON T_EquipmentShipDetail.Universal_ID_M_Ship = M_Ship.Universal_ID_M_Ship
                    WHERE
                        T_EquipmentShipDetail.Nomenclature = ?
                        AND M_Ship.ShipName = ?
                        AND T_Dart.Active = 1
                        AND T_EquipmentShipDetail.Active = 1
                        AND T_Dart.Is_Defect = 1
                        AND T_Dart.RoutineDefect = 2;
                        '''
                pointer.execute(fetch_query, (component_id,nomenclature,ship_name))
                fetched_data = pointer.fetchall()
                print(fetched_data)
                # fetched_data_dict_list=[{"component_id":row.component_id,"date":row.date}for row in fetched_data]
                # return fetched_data_dict_list
                overhaul_id=uuid.uuid4()
                maintenance_type='Corrective Maintainance'
                for data_point in fetched_data:
                    # Extract data from the second query result
                    component_id, date = data_point
                    # print(f"Committing data: ID={generated_id}, Component ID={component_id}, Overhaul ID={overhaul_id}, Date={date}")
                    # Generate a new UUID for each iteration
                    generated_id = uuid.uuid4()


                    # Third Query: Insert or update data using the merge statements
                    merge_query = """
                    MERGE INTO data_manager_overhaul_maint_data AS target
                    USING (VALUES (?, ?, ?, ?, ?,NULL, ?, NULL)) AS source (id, component_id, overhaul_id, date, maintenance_type, running_age, associated_sub_system, cmms_running_age)
                    ON target.component_id = source.component_id
                    AND target.date = source.date
                    WHEN NOT MATCHED THEN
                    INSERT (id, component_id, overhaul_id, date, maintenance_type, running_age, associated_sub_system, cmms_running_age)
                    VALUES (?, ?, ?, ?, ?,NULL, ?, NULL);
                    """

                    cursor.execute(merge_query, (generated_id, component_id, overhaul_id,date,maintenance_type,
                                                 component_id,generated_id, component_id, overhaul_id, date,maintenance_type,
                                               component_id,))
            # Commit changes to the database
            cursor.commit()

            # Return a message if the process is completed
            return "ETL process completed successfully"

        except Exception as e:
            # Return an error message if something went wrong
            return f"Error during ETL process: {str(e)}"
        
    def overhaul_data_reset(self, component_id, nomenclature, ship_name):
        # First, delete existing data for the specified component_id
        delete_query = '''
            DELETE FROM data_manager_overhaul_maint_data
            WHERE component_id = ?;
        '''
        cursor.execute(delete_query, (component_id,))
        cursor.commit()
        try:
            fetch_query = '''
                SELECT
                    ? AS component_id,
                    CONVERT(VARCHAR, T_Dart.DefectDate, 23) AS date
                FROM
                    t_DART WITH (NOLOCK)
                    INNER JOIN T_EquipmentShipDetail (NOLOCK) ON T_Dart.Universal_ID_T_EquipmentShipDetail = T_EquipmentShipDetail.Universal_ID_T_EquipmentShipDetail
                    INNER JOIN M_Ship WITH (NOLOCK) ON T_EquipmentShipDetail.Universal_ID_M_Ship = M_Ship.Universal_ID_M_Ship
                WHERE
                    T_EquipmentShipDetail.Nomenclature = ?
                    AND M_Ship.ShipName = ?
                    AND T_Dart.Active = 1
                    AND T_EquipmentShipDetail.Active = 1
                    AND T_Dart.Is_Defect = 1
                    AND T_Dart.RoutineDefect = 2;
            '''
            cursor.execute(fetch_query, (component_id, nomenclature, ship_name))
            fetched_data = cursor.fetchall()

            overhaul_id = uuid.uuid4()
            maintenance_type = 'Corrective Maintenance'

            for data_point in fetched_data:
                component_id, date = data_point

                merge_query = """
                MERGE INTO data_manager_overhaul_maint_data AS target
                USING (VALUES (?, ?, ?, ?, ?, NULL, ?, NULL)) AS source (id, component_id, overhaul_id, date, maintenance_type, running_age, associated_sub_system, cmms_running_age)
                ON target.component_id = source.component_id
                AND target.date = source.date
                WHEN NOT MATCHED THEN
                INSERT (id, component_id, overhaul_id, date, maintenance_type, running_age, associated_sub_system, cmms_running_age)
                VALUES (?, ?, ?, ?, ?, NULL, ?, NULL);
                """

                cursor.execute(merge_query, (uuid.uuid4(), component_id, overhaul_id, date, maintenance_type,
                                            uuid.uuid4(), component_id, overhaul_id, date, maintenance_type, component_id))

            cursor.commit()
            
            # Return a message if the process is completed
            return "ETL process completed successfully"

        except Exception as e:
            # Return an error message if something went wrong
            return f"Error during ETL process: {str(e)}"
