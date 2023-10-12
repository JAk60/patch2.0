from dB.dB_connection import cursor, cnxn
from flask import jsonify


class Custom_Settings():
    def fetch_user_selection(self, toJson=True):
        sql = '''select * from user_selection'''
        systemSql = '''select ship_name, ship_category, ship_class, command, department, 
        component_name, nomenclature from system_configuration where parent_id is  null'''
        cursor.execute(sql)
        unique_system_id_sql = '''select distinct ship_name ,component_id,component_name, nomenclature
         from system_configuration where parent_id is  null
        '''
        # eqData = [{} for r in eqData]
        data = cursor.fetchall()
        cursor.execute(systemSql)
        eqData = cursor.fetchall()
        cursor.execute(unique_system_id_sql)
        uniq_eq_data = cursor.fetchall()
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
        uniq_eq_data = [{"name": r[2],"nomenclature":r[3], "id": r[1], "ship_name": r[0]} for r in uniq_eq_data]
        fData = {'data': data, 'eqData': eqData, "uniq_eq_data": uniq_eq_data}
        if toJson:
            fData = jsonify(fData)
        return fData