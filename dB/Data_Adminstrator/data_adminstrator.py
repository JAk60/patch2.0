from dB.dB_connection import pointer, cnxn, cursor
from flask import Flask, jsonify
import uuid


class Data_Administrator:
    def delete_data_for_component(self, data):
        print(data)
        data = data["values"]
        component_id = data["component_id"]
        table_names = [
            "alpha_beta",
            "data_manager_actual_data",
            "data_manager_expert",
            "data_manager_interval_data",
            "data_manager_maintenance_data",
            "data_manager_nprd",
            "data_manager_oem",
            "data_manager_oem_expert",
            "data_manager_overhaul_maint_data",
            "data_manager_overhauls_info",
            "data_manager_prob_failure",
            "data_manager_repairable_import",
            "data_manager_replacable_import",
            "duty_cycle",
            "eta_beta",
            "failure_modes",
            "maintenance_configuration_data",
            "operational_data",
            "parallel_configuration",
            "parameter_data",
            "phase_duty_cycle",
            "phase_life_multiplier",
            "redundancy_data",
            "sensor_based_data",
            "system_config_additional_info",
            "system_config_additional_info_parallel",
            "system_duty_cycle",
            "TTF_data",
            "phase_definition",
            "system_configuration"
        ]


        for table_name in table_names:
            try:
                # Assuming 'component_id' is a column in each table
                delete_query = '''DELETE FROM {} WHERE component_id = ?'''.format(
                    table_name)
                cursor.execute(delete_query, (component_id,))
                cnxn.commit()  # Commit changes to the database
            except Exception as e:
                # Handle exceptions if needed
                print(f"Error deleting data from {table_name}: {str(e)}")
                return {"code": 0, "message": f"Error deleting data from {table_name}: {str(e)}"}

        return {"code": 1, "message": "Information successfully Deleted."}

    def del_specific_data(self, data):
        data_values = data.get("values", {})
        component_id = data_values.get("component_id", None)
        table_name = data_values.get("table", None)
        failure_mode = data_values.get("failure_mode", None)
        operation_date = data_values.get("operation_date", None)
        date = data_values.get("date", None)
        value = data_values.get("value", None)

        if not component_id or not table_name:
            print("Invalid data. Both 'component_id' and 'table' must be provided.")
            return {"message": "Invalid data. Both 'component_id' and 'table' must be provided."}

        try:
            if table_name == "failure_modes":
                # Assuming 'failure_mode' is a parameter for 'failure_modes' table
                fmodeQ = '''DELETE FROM failure_modes WHERE component_id = ? AND failure_mode= ?'''
                cursor.execute(fmodeQ, (component_id, failure_mode))
            elif table_name == "operational_data":
                # Assuming 'operation_date' is a parameter for 'operational_data' table
                opdQ = '''DELETE FROM operational_data WHERE component_id = ? and operation_date= ?'''
                cursor.execute(opdQ, (component_id, operation_date))
            elif table_name == "data_manager_overhaul_maint_data":
                # Assuming 'date' is a parameter for 'data_manager_overhaul_maint_data' table
                omQ = '''DELETE FROM data_manager_overhaul_maint_data WHERE component_id = ? AND date= ?'''
                cursor.execute(omQ, (component_id, date))
            elif table_name == "parameter_data":
                # Assuming 'value' is a parameter for 'parameter_data' table
                pmQ = '''DELETE FROM parameter_data WHERE component_id = ? AND value= ?'''
                cursor.execute(pmQ, (component_id, value))
            else:
                # For other tables with only 'component_id' as a parameter
                basic = '''DELETE FROM {} WHERE component_id = ?'''.format(
                    table_name)
                cursor.execute(basic, (component_id,))

            cnxn.commit()  # Commit changes to the database
            print(
                f"Deleted data from {table_name} for component_id {component_id}")
            return {"code": 1, "message": "Information successfully Deleted."}

        except Exception as e:
            # Handle exceptions if needed
            print(f"Error deleting data from {table_name}: {str(e)}")
            return {"code": 0, "message": f"Error deleting data from {table_name}: {str(e)}"}

    def specific_data(self, data):
        values = data["values"]
        component_id = values["component_id"]
        table_name = values["table"]

        # Query to get column names
        column_query = f"SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '{table_name}';"

        # Query to get specific data based on component_id
        data_query = f"SELECT * FROM {table_name} WHERE component_id = ?;"

        try:
            # Execute the query to get column names
            cursor.execute(column_query)
            columns = [row.COLUMN_NAME for row in cursor.fetchall()]

            # Execute the query to get specific data based on component_id
            cursor.execute(data_query, component_id)
            rows = cursor.fetchall()

            # Convert rows to a list of dictionaries
            data = [dict(zip(columns, row)) for row in rows]

            # Update columns array to match the desired format
            columns_array = [
                {"field": col, "headerName": col.capitalize().replace("_", " "),
                 "width": 250}
                for col in columns
            ]

            # Response dictionary
            response = {"columns": columns_array,
                        "columnData": data, "code": 1}

            # Processing logic or return the response as needed
            return response

        except Exception as e:
            print(f"Error: {e}")

    def get_equipments_onship(self, data):
        try:
            shipName = data["shipName"]
            department = data["department"]
            print(shipName)
            equpQ = '''SELECT component_name, nomenclature,etl
                        FROM system_configuration 
                        WHERE ship_name = ? and department= ?'''
            cursor.execute(equpQ, (shipName, department))
            result = cursor.fetchall()
            equipments = [{"component_name": row[0],
                           "nomenclature": row[1], "etl": row[2]} for row in result]
            return {"code": 1, "equipments": equipments}

        except KeyError:
            return {"status": "error", "message": "Missing 'shipName' in request data"}

        except Exception as e:
            return {"code": 0, "message": f"Error fetching equipments on {shipName}: {str(e)}"}

    def register_equipment(self, data):
        try:
            print("datalll",data)
            register_all = data['registerAll']
            print(register_all)
            if register_all:
                # Run a query for registerAll being True
                query = '''
                    SELECT 
                        EquipmentName as component_name,
                        M_Equipment.EquipmentCode as CMMS_EquipmentCode,
                        ShipName as ship_name,
                        M_ShipCategory.ShipCategoryName as ship_category,
                        M_ShipClass.Description as ship_class,
                        CommandName as command,
                        M_Department.Description as department,
                        Nomenclature as nomenclature
                    FROM 
                        T_EquipmentShipDetail WITH(NOLOCK) 
                        INNER JOIN M_Equipment WITH(NOLOCK) ON T_EquipmentShipDetail.Universal_ID_M_Equipment = M_Equipment.Universal_ID_M_Equipment
                        INNER JOIN M_Ship WITH(NOLOCK) ON T_EquipmentShipDetail.Universal_ID_M_Ship = M_Ship.Universal_ID_M_Ship
                        INNER JOIN M_ShipClass WITH(NOLOCK) ON M_Ship.Universal_ID_M_ShipClass = M_ShipClass.Universal_ID_M_ShipClass
                        INNER JOIN M_ShipCategory WITH(NOLOCK) ON M_Ship.Universal_ID_M_ShipCategory = M_ShipCategory.Universal_ID_M_ShipCategory
                        INNER JOIN M_Command WITH(NOLOCK)  ON M_Ship.Universal_ID_M_Command = M_Command.Universal_ID_M_Command 
                        INNER JOIN M_Department WITH(NOLOCK) ON T_EquipmentShipDetail.Universal_ID_M_Department = M_Department.Universal_ID_M_Department
                    WHERE 
                        T_EquipmentShipDetail.Active = 1 
                        AND RemovalDate IS NULL 
                        AND M_Ship.Active = 1
                        AND M_Ship.DecommissionDate IS NULL 
                        AND M_ShipClass.Active = 1 
                        AND ShipName= ?;
                    '''
                # Execute the query using the pointer object
                pointer.execute(query, (ship_name,))

                # Fetch the data
                fetched_data = pointer.fetchall()

                for data_point in fetched_data:
                    # Extract data from the result
                    component_name, CMMS_EquipmentCode, ship_name, ship_category, ship_class, command, department, nomenclature = data_point

                    # Generate new UUIDs for each iteration
                    component_id = uuid.uuid4()

                    # Merge query
                    merge_query = """
                        MERGE INTO system_configuration AS target
                        USING (VALUES (?, ?)) AS source (
                            nomenclature,
                            ship_name
                        )
                        ON target.nomenclature = source.nomenclature AND target.ship_name = source.ship_name
                        WHEN NOT MATCHED THEN
                            INSERT (
                                component_id,
                                component_name,
                                CMMS_EquipmentCode,
                                ship_name,
                                ship_category,
                                ship_class,
                                command,
                                department,
                                nomenclature,
                                etl
                            )
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0);
                        """

                    # Execute the merge query using the cursor object
                    cursor.execute(merge_query, (
                        nomenclature, ship_name,
                        component_id, component_name, CMMS_EquipmentCode,
                        ship_name, ship_category, ship_class,
                        command, department, nomenclature))
                    cursor.commit()
            else:
                for nomenclature_entry in data['nomenclature']:
                    ship_name = data['shipName']
                    nomenclature = nomenclature_entry['value']
                    print(nomenclature)   
                    # Run a query for registerAll being False
                    query = '''
                        SELECT 
                            EquipmentName as component_name,
                            M_Equipment.EquipmentCode as CMMS_EquipmentCode,
                            ShipName as ship_name,
                            M_ShipCategory.ShipCategoryName as ship_category,
                            M_ShipClass.Description as ship_class,
                            CommandName as command,
                            M_Department.Description as department,
                            Nomenclature as nomenclature
                        FROM 
                            T_EquipmentShipDetail WITH(NOLOCK) 
                            INNER JOIN M_Equipment WITH(NOLOCK) ON T_EquipmentShipDetail.Universal_ID_M_Equipment = M_Equipment.Universal_ID_M_Equipment
                            INNER JOIN M_Ship WITH(NOLOCK) ON T_EquipmentShipDetail.Universal_ID_M_Ship = M_Ship.Universal_ID_M_Ship
                            INNER JOIN M_ShipClass WITH(NOLOCK) ON M_Ship.Universal_ID_M_ShipClass = M_ShipClass.Universal_ID_M_ShipClass
                            INNER JOIN M_ShipCategory WITH(NOLOCK) ON M_Ship.Universal_ID_M_ShipCategory = M_ShipCategory.Universal_ID_M_ShipCategory
                            INNER JOIN M_Command WITH(NOLOCK)  ON M_Ship.Universal_ID_M_Command = M_Command.Universal_ID_M_Command 
                            INNER JOIN M_Department WITH(NOLOCK) ON T_EquipmentShipDetail.Universal_ID_M_Department = M_Department.Universal_ID_M_Department
                        WHERE 
                            T_EquipmentShipDetail.Active = 1 
                            AND RemovalDate IS NULL 
                            AND M_Ship.Active = 1
                            AND M_Ship.DecommissionDate IS NULL 
                            AND M_ShipClass.Active = 1 
                            AND ShipName= ? 
                            AND Nomenclature= ?;
                        '''
                    # Execute the query using the pointer object
                    pointer.execute(query, (ship_name, nomenclature))

                # Fetch the data
                fetched_data = pointer.fetchall()
                print(fetched_data)

                for data_point in fetched_data:
                    # Extract data from the result
                    component_name, CMMS_EquipmentCode, ship_name, ship_category, ship_class, command, department, nomenclature = data_point

                    # Generate new UUIDs for each iteration
                    component_id = uuid.uuid4()

                    # Third Query: Insert or update data using the merge statements
                    merge_query = """
                        MERGE INTO system_configuration AS target
                        USING (VALUES (?, ?)) AS source (
                            nomenclature,
                            ship_name
                        )
                        ON target.nomenclature = source.nomenclature AND target.ship_name = source.ship_name
                        WHEN NOT MATCHED THEN
                            INSERT (
                                component_id,
                                component_name,
                                CMMS_EquipmentCode,
                                ship_name,
                                ship_category,
                                ship_class,
                                command,
                                department,
                                nomenclature,
                                etl
                            )
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0);
                        """

                    # Execute the merge query using the cursor object
                    cursor.execute(merge_query, (
                        nomenclature, ship_name,
                        component_id, component_name, CMMS_EquipmentCode,
                        ship_name, ship_category, ship_class,
                        command, department, nomenclature))

                # Commit changes to the database
                cursor.commit()

                additional_query = """
                INSERT INTO user_selection (ship_name, ship_category, ship_class, command, department) 
                SELECT DISTINCT 
                    sc.ship_name COLLATE SQL_Latin1_General_CP1_CI_AS,
                    sc.ship_category COLLATE SQL_Latin1_General_CP1_CI_AS,
                    sc.ship_class COLLATE SQL_Latin1_General_CP1_CI_AS,
                    sc.command COLLATE SQL_Latin1_General_CP1_CI_AS,
                    sc.department COLLATE SQL_Latin1_General_CP1_CI_AS
                FROM system_configuration sc
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM user_selection us
                    WHERE 
                        us.ship_name COLLATE SQL_Latin1_General_CP1_CI_AS = sc.ship_name COLLATE SQL_Latin1_General_CP1_CI_AS AND
                        us.ship_category COLLATE SQL_Latin1_General_CP1_CI_AS = sc.ship_category COLLATE SQL_Latin1_General_CP1_CI_AS AND
                        us.ship_class COLLATE SQL_Latin1_General_CP1_CI_AS = sc.ship_class COLLATE SQL_Latin1_General_CP1_CI_AS AND
                        us.command COLLATE SQL_Latin1_General_CP1_CI_AS = sc.command COLLATE SQL_Latin1_General_CP1_CI_AS AND
                        us.department COLLATE SQL_Latin1_General_CP1_CI_AS = sc.department COLLATE SQL_Latin1_General_CP1_CI_AS
                );
                """

                # Execute the additional query using the cursor object
                cursor.execute(additional_query)

                # Commit changes to the database
                cursor.commit()

                # Return a message if the process is completed
                return "ETL process completed successfully"

        except Exception as e:
            # Rollback changes in case of an error
            cnxn.rollback()
            return jsonify({'status': 'error', 'message': f'Error executing the query: {str(e)}'})

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
            cursor.execute(
                fetch_query, (component_id, nomenclature, ship_name))
            fetched_data = cursor.fetchall()
            print()

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
