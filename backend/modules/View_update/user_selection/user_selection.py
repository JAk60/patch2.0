from backend.dB.dB_connection import pointer, cnxn, cursor
from flask import jsonify
import pyodbc
from backend.dB.user_selection.user_selection_queries import (
    FETCH_USER_SELECTION,
    FETCH_SYSTEM_CONFIGURATION,
    FETCH_UNIQUE_SYSTEM_IDS,
    FETCH_CMMS_SELECTION,
)


class Custom_Settings():
    def fetch_user_selection(self, toJson=True):
        try:
            cursor.execute(FETCH_USER_SELECTION)
            data = cursor.fetchall()

            cursor.execute(FETCH_SYSTEM_CONFIGURATION)
            eqData = cursor.fetchall()

            cursor.execute(FETCH_UNIQUE_SYSTEM_IDS)
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

            uniq_eq_data = [{"name": r[2], "nomenclature": r[3],
                             "id": r[1], "ship_name": r[0]} for r in uniq_eq_data]

            fData = {'data': data, 'eqData': eqData,
                     "uniq_eq_data": uniq_eq_data}

            if toJson:
                fData = jsonify(fData)

            return fData

        except pyodbc.Error as ex:
            print(f"Error: {ex}")
            raise

    def fetch_cmms_selection(self):
        pointer.execute(FETCH_CMMS_SELECTION)
        fetched_data = pointer.fetchall()
        print(fetched_data)
        results = []

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
        print(results)
        return results