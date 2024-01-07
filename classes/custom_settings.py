from dB.dB_connection import cursor, cnxn
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