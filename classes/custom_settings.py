from dB.dB_connection import pointer, cnxn, cursor
from flask import jsonify
import pyodbc

class Custom_Settings():
    def fetch_user_selection(self, toJson=True):
        try:
            sql = '''select * from user_selection'''
            systemSql = '''select ship_name, ship_category, ship_class, command, department, 
            component_name, nomenclature from system_configuration where parent_id is null'''
            
            # Fetching user_selection data
            cursor.execute(sql)
            data = cursor.fetchall()

            # Fetching system_configuration data
            cursor.execute(systemSql)
            eqData = cursor.fetchall()

            # Fetching unique_system_id data
            unique_system_id_sql = '''select distinct ship_name, component_id, component_name, nomenclature
                from system_configuration where parent_id is null
            '''
            cursor.execute(unique_system_id_sql)
            uniq_eq_data = cursor.fetchall()

            # Processing data into desired format
            eqData = [{
                'shipName': r[0],
                'shipCategory': r[1],
                'shipClass': r[2],
                'command': r[3],
                'department': r[4],
                'equipmentName': r[5],
                'nomenclature': r[6]
            } for r in eqData]

            data = [{
                'shipName': r[0],
                'shipCategory': r[1],
                'shipClass': r[2],
                'command': r[3],
                'department': r[4],
            } for r in data]

            uniq_eq_data = [{"name": r[2], "nomenclature": r[3], "id": r[1], "ship_name": r[0]} for r in uniq_eq_data]

            fData = {'data': data, 'eqData': eqData, "uniq_eq_data": uniq_eq_data}

            if toJson:
                fData = jsonify(fData)

            return fData

        except pyodbc.Error as ex:
            # Print or log the actual error
            print(f"Error: {ex}")
            # Optionally, re-raise the exception to propagate it further
            raise
    
    # def fetch_cmms_selection(self):
    #     query = '''
    #                 SELECT 
    #                     EquipmentName as component_name,
    #                     M_Equipment.EquipmentCode as CMMS_EquipmentCode,
    #                     ShipName as ship_name,
    #                     M_ShipCategory.ShipCategoryName as ship_category,
    #                     M_ShipClass.Description as ship_class,
    #                     CommandName as command,
    #                     M_Department.Description as department,
    #                     Nomenclature as nomenclature
    #                 FROM 
    #                     T_EquipmentShipDetail WITH(NOLOCK) 
    #                     INNER JOIN M_Equipment WITH(NOLOCK) ON T_EquipmentShipDetail.Universal_ID_M_Equipment = M_Equipment.Universal_ID_M_Equipment
    #                     INNER JOIN M_Ship WITH(NOLOCK) ON T_EquipmentShipDetail.Universal_ID_M_Ship = M_Ship.Universal_ID_M_Ship
    #                     INNER JOIN M_ShipClass WITH(NOLOCK) ON M_Ship.Universal_ID_M_ShipClass = M_ShipClass.Universal_ID_M_ShipClass
    #                     INNER JOIN M_ShipCategory WITH(NOLOCK) ON M_Ship.Universal_ID_M_ShipCategory = M_ShipCategory.Universal_ID_M_ShipCategory
    #                     INNER JOIN M_Command WITH(NOLOCK)  ON M_Ship.Universal_ID_M_Command = M_Command.Universal_ID_M_Command 
    #                     INNER JOIN M_Department WITH(NOLOCK) ON T_EquipmentShipDetail.Universal_ID_M_Department = M_Department.Universal_ID_M_Department
    #                 WHERE 
    #                     T_EquipmentShipDetail.Active = 1 
    #                     AND RemovalDate IS NULL 
    #                     AND M_Ship.Active = 1
    #                     AND M_Ship.DecommissionDate IS NULL 
    #                     AND M_ShipClass.Active = 1 
    #                     AND ShipName= ?;
    #                     '''
    #     q='''select * from ShipComponents'''
    #     pointer.execute(q)
    #     fetched_data = pointer.fetchall()
    #     print(fetched_data)
    #     results = []
    
    # # Iterate through the fetched data and create dictionaries
    #     for row in fetched_data:
    #         result_dict = {
    #             'ship_name': row[0],
    #             'equipment': row[1],
    #             'CMMSCode': row[2],
    #             'department': row[3],
    #             'nomenclature': row[4]
    #         }
    #         results.append(result_dict)
    #     return results
    #     pass

    def fetch_cmms_selection(self):
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

        pointer.execute(query)
        fetched_data = pointer.fetchall()
        print(fetched_data)
        results = []

        # Iterate through the fetched data and create dictionaries
        for row in fetched_data:
            result_dict = {
                'component_name': row[0],
                'CMMS_EquipmentCode': row[1],
                'ship_name': row[2],
                'ship_category': row[3],
                'ship_class': row[4],
                'command': row[5],
                'department': row[6],
                'nomenclature': row[7]
            }
            results.append(result_dict)
        
        return results
