from dB.dB_connection import cursor, cnxn
from dB.condition_monitoring.conditionMonitoringdB_table import conditionMonitoringdB_Table
from dB.condition_monitoring.condition_monitoring_queries import (
    INSERT_SENSOR_BASED_DATA,
    INSERT_SENSOR_PARAMETER_ATTRIBUTES,
    INSERT_SENSOR_ALARM_DATA,
    INSERT_SENSOR_ALARM_ATTRIBUTES,
    INSERT_PARAMETER_DATA,
    FETCH_SENSOR_BY_COMPONENT,
    FETCH_ALL_SENSORS_WITH_CONFIG,
    FETCH_PARAM_ID_BY_COMPONENT_AND_NAME,
    FETCH_CM_DATA,
    FETCH_PARAMETER_DATA_BY_PARAM_ID,
    FETCH_SENSOR_PARAM_ATTRIBUTES_BY_PARAM_ID,
    FETCH_DISPLAY_DATA,
    UPDATE_SENSOR_BASED_DATA,
    UPDATE_SENSOR_PARAMETER_ATTRIBUTES,
)
from uuid import uuid4


class conditionMonitoring_dB():
    def __init__(self):
        conditionMonitoringdB_Table()
        self.success_return = {"message": "Data Saved Successfully.",
                               "code": 1}
        self.error_return = {"message": "Some Error Occured, Please try again.",
                             "code": 0}

    def save_dataToDB(self, data, dtype):
        res = ''
        if dtype == 'insertSensor':
            try:
                res = self.insert_sensor(data['sData'])
                res = self.insert_sensor_param_attributes(data['lData'])
                res = self.insert_sensor_alarm(data['aData'])
                res = self.insert_sensor_alarm_attributes(data['alarmAtts'])
            except Exception as e:
                return self.error_return
        if dtype == 'insertParamData':
            res = self.insert_param_data(data)
        return res

    def insert_sensor(self, data):
        try:
            for d in data:
                component_id = d['ComponentId']
                equipment_id = d['EquipmentId']
                sensor_id = d['id']
                failure_mode_id = d['FailureModeId']
                name = d['name']
                frequency = d['frequency']
                unit = d['unit']
                min_value = d['min']
                max_value = d['max']
                P = d['P']
                F = d['F']

                cursor.execute(
                    INSERT_SENSOR_BASED_DATA,
                    sensor_id, component_id, equipment_id, name, failure_mode_id,
                    frequency, unit, min_value, max_value, P, F
                )
            cursor.commit()
            return self.success_return
        except Exception as e:
            return self.error_return

    def insert_sensor_param_attributes(self, data):
        for d in data:
            parameter_id = d['pid']
            id = d['id']
            threshold = d['threshold']
            level = d['level']

            cursor.execute(INSERT_SENSOR_PARAMETER_ATTRIBUTES, id, parameter_id, level, threshold)
        cursor.commit()
        return self.success_return

    def insert_sensor_alarm(self, data):
        for d in data:
            id = d['id']
            alarm = d['alarm']

            cursor.execute(INSERT_SENSOR_ALARM_DATA, id, alarm)
        cursor.commit()
        return self.success_return

    def insert_sensor_alarm_attributes(self, data):
        for d in data:
            alarm_id = d['AlarmId']
            id = d['id']
            parameter_id = d['paramId']
            level_id = d['lvlId']

            cursor.execute(INSERT_SENSOR_ALARM_ATTRIBUTES, id, alarm_id, parameter_id, level_id)
        cursor.commit()
        return self.success_return

    def fetch_params(self, cId):
        try:
            print(cId)
            cursor.execute(FETCH_SENSOR_BY_COMPONENT, cId)
            rows = cursor.fetchall()
            data = []
            for row in rows:
                data.append({
                    'id': row[0],
                    'componentId': row[1],
                    'equipmentId': row[2],
                    'failureModeId': row[3],
                    'name': row[4],
                    'min': row[5],
                    'max': row[6],
                    'unit': row[7],
                    'level': row[8],
                    'frequency': row[9],
                    'data': row[10]
                })
            return data
        except Exception as e:
            return e

    def fetch_all_params(self):
        try:
            cursor.execute(FETCH_ALL_SENSORS_WITH_CONFIG)
            rows = cursor.fetchall()
            data = []
            for row in rows:
                data.append({
                    'name': row[0],
                    'equipment_id': row[1],
                    'id': row[2],
                    'max_value': row[3],
                    'min_value': row[4],
                    'equipmentName': row[5],
                    'nomenclature': row[6]
                })
            return data
        except Exception as e:
            return e

    def fetch_param_id(self, component_id, name):
        try:
            cursor.execute(FETCH_PARAM_ID_BY_COMPONENT_AND_NAME, component_id, name)
            data = cursor.fetchone()[0]
            return data
        except Exception as e:
            return e

    def insert_param_data(self, data):
        try:
            for d in data:
                component_id = d['componentId']
                id = d['id']
                name = d['parameterName']
                value = d['value']
                date = d['date']
                operating_hours = d['operatingHours']

                if 'paramId' in d and d['paramId'] is not None:
                    parameter_id = d['paramId']
                else:
                    parameter_id = self.fetch_param_id(component_id, name)

                print(parameter_id)

                cursor.execute(
                    INSERT_PARAMETER_DATA,
                    (id, component_id, parameter_id, name, value, date, operating_hours)
                )

            cursor.commit()
            return self.success_return

        except Exception as e:
            return self.error_return

    def fetch_cmdata(self, eIds, pNames):
        data = []
        for equipment in eIds:
            for parameter in pNames:
                print("Equipment ID:", equipment)
                print("Parameter Name:", parameter)
                cursor.execute(FETCH_CM_DATA, (equipment, parameter))
                rows = cursor.fetchall()
                for row in rows:
                    data.append({
                        'pid': row[0],
                        'componentId': row[1],
                        'equipmentId': row[2],
                        'parameterName': row[3],
                        'equipmentName': row[4],
                        'componentName': row[5],
                        'data': [],
                        'sensor_data': []
                    })

        for param in data:
            cursor.execute(FETCH_PARAMETER_DATA_BY_PARAM_ID, param['pid'])
            param_rows = cursor.fetchall()
            for row in param_rows:
                param['data'].append({'date': row[0], 'value': row[1]})

        for param in data:
            cursor.execute(FETCH_SENSOR_PARAM_ATTRIBUTES_BY_PARAM_ID, param['pid'])
            param_rows = cursor.fetchall()
            for row in param_rows:
                param['sensor_data'].append({'level': row[0], 'threshold': row[1]})

        return data

    def fetch_data_for_display(self, equipment_id, type):
        if type == 'display':
            component_id = equipment_id["id"]
            cursor.execute(FETCH_DISPLAY_DATA, component_id)
            data = cursor.fetchall()
            main_data = []
            for row in data:
                main_data.append({
                    "id": row[0],
                    "attr_id": row[1],
                    "failure_mode_id": row[2],
                    "name": row[3],
                    "min_value": row[4],
                    "max_value": row[5],
                    "unit": row[6],
                    "level": row[8],
                    "threshold": row[9]
                })
            return main_data

        elif type == "update":
            try:
                for row in equipment_id:
                    failure_mode = row["failure_mode_id"]
                    level = row["level"]
                    max_val = row["max_value"]
                    min_val = row["min_value"]
                    name = row["name"]
                    unit = row["unit"]
                    threshold = row["threshold"]
                    id = row["id"]
                    uid = str(uuid4())
                    attr_id = row["attr_id"]

                    cursor.execute(UPDATE_SENSOR_BASED_DATA, failure_mode, name, min_val, max_val, unit, id)
                    cursor.execute(UPDATE_SENSOR_PARAMETER_ATTRIBUTES, level, threshold, attr_id)
                    cursor.commit()
                return "Saved Successfully!!"
            except Exception as e:
                return "Not Updated"
        else:
            return self.delete_params(equipment_id)

    def delete_params(self, equipment):
        cid = equipment["id"]