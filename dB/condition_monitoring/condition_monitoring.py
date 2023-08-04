from dB.dB_connection import cursor, cnxn
from dB.condition_monitoring.conditionMonitoringdB_table import conditionMonitoringdB_Table

from uuid import uuid4


class conditionMonitoring_dB():
    def __init__(self):
        conditionMonitoringdB_Table()
        self.success_return = {"message": "Data Saved Successfully.",
                               "code": 1}
        self.error_return = {"message": "Some Error Occured, Please try agian.",
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
                print(e)
                self.error_return['message'] = str(e)
                return self.error_return
        if dtype == 'insertParamData':
            res = self.insert_param_data(data)
        # if dtype == 'insertExtFactors':
        #     res = self.insert_ext_factors(data)
        # if dtype == 'insertLifeMultiplier':
        #     res = self.insert_life_multiplier(data)
        return res

    def insert_sensor(self, data):
        try:
            for d in data:
                print(d)
                component_id = d['ComponentId']
                equipment_id = d['EquipmentId']
                sensor_id = d['id']
                failure_mode_id = d['FailureModeId']
                # channel_name = d['channel_name']  # Assuming you have a 'channel_name' field in the data
                # print(channel_name)
                name = d['name']
                frequency = d['frequency']
                unit = d['unit']
                min_value = d['min']
                max_value = d['max']
                param_data = d['data']
                level = d['level']
                P = d['P']  # Assuming you have a 'P' field in the data
                F = d['F']  # Assuming you have an 'F' field in the data

                insert_sensor_based = '''
                    INSERT INTO sensor_based_data
                        (id, component_id, equipment_id, name, failure_mode_id, frequency, unit,
                        min_value, max_value, data, level, P, F)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                '''

                cursor.execute(insert_sensor_based, sensor_id, component_id, equipment_id, name, failure_mode_id,
                                                     frequency, unit, min_value, max_value,
                                                    param_data, level, P, F)
            cursor.commit()
            return self.success_return()  # Assuming success_return() returns the desired response for success
        except Exception as e:
        # Handle any exceptions that might occur during the execution or database commit
        # You can log the error or raise an appropriate exception
            print(f"Error occurred: {str(e)}")
            return self.error_return()  # Assuming error_return() returns the desired response for errors

    def insert_sensor_param_attributes(self, data):
        # print(data)
        # try:
        for d in data:

            parameter_id = d['pid']
            id = d['id']
            threshold = d['threshold']
            level = d['level']

            insert_spa = '''INSERT INTO sensor_parameter_attributes (id, parameter_id,
                            level,threshold)
                                    VALUES (?, ?, ?, ?);'''

            cursor.execute(insert_spa, id, parameter_id, level, threshold)
        cursor.commit()
        return self.success_return
        # except Exception as e:
        #     print(e)
        #     self.error_return['message'] = str(e)
        #     return self.error_return

    def insert_sensor_alarm(self, data):

        for d in data:
            id = d['id']
            alarm = d['alarm']

            insert_sensor_alarm = '''INSERT INTO sensor_alarm_data (id, alarm)
                                    VALUES (?, ?);'''

            cursor.execute(insert_sensor_alarm, id, alarm)
        cursor.commit()
        return self.success_return

    def insert_sensor_alarm_attributes(self, data):
        # print(data)
        # try:
        for d in data:

            alarm_id = d['AlarmId']
            id = d['id']
            parameter_id = d['paramId']
            level_id = d['lvlId']

            insert_apa = '''INSERT INTO sensor_alarm_attributes (id, alarm_id,
                            parameter_id,level_id)
                                    VALUES (?, ?, ?, ?);'''

            cursor.execute(insert_apa, id, alarm_id, parameter_id, level_id)
        cursor.commit()
        return self.success_return
        # except Exception as e:
        #     print(e)
        #     self.error_return['message'] = str(e)
        #     return self.error_return

    def fetch_params(self, cId):
        try:
            sql = '''select * from sensor_based_data where component_id=?'''
            cursor.execute(sql, cId)
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

    # def fetch_all_params(self):
    #     try:
    #         sql = '''select distinct (name) from sensor_based_data'''
    #         cursor.execute(sql)
    #         rows = cursor.fetchall()
    #         data = []
    #         for row in rows:
    #             data.append({'name': row[0]})
    #         return data
    #     except Exception as e:
    #         return e


    def fetch_all_params(self):
        try:
            sql = "select distinct(name),  equipment_id ,id, max_value, min_value from sensor_based_data where sensor_based_data.name <> ''"
            cursor.execute(sql)
            rows = cursor.fetchall()
            data = []
            for row in rows:
                data.append({'name': row[0],'equipment_id': row[1],'id': row[2], 'max_value': row[3], 'min_value': row[4]})
            return data
        except Exception as e:
            return e

    def insert_param_data(self, data):
        # print(data)
        try:
            for d in data:

                component_id = d['componentId']
                parameter_id = d['paramId']
                id = d['id']
                name = d['parameterName']
                value = d['value']
                date = d['date']
                operating_hours = d['operatingHours']

                insert_param_data = '''INSERT INTO parameter_data (id, component_id,parameter_id, name,value,date, operating_hours)
                                        VALUES (?, ?, ?, ?, ?, ?, ?);'''

                cursor.execute(insert_param_data, id, component_id,
                               parameter_id, name, value, date,operating_hours)
            cursor.commit()
            return self.success_return
        except Exception as e:
            return e

    def fetch_cmdata(self, eIds, pNames):
        sql = '''select id,T1.component_id,equipment_id,name as parameter_name,
        T2.component_name as equipment_name,
        T3.component_name as component_name
        from sensor_based_data as T1 
        join system_configuration as T2 
        on T1.equipment_id=T2.component_id 
        join system_configuration as T3 
        on T3.component_id=T1.component_id  
        where equipment_id=? and name=?
        '''
        data = []
        for equipment in eIds:
            for parameter in pNames:
                print("Equipment ID:", equipment)
                print("Parameter Name:", parameter)
                cursor.execute(sql, (equipment, parameter))
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
            param_sql = '''
            select date,value from parameter_data where parameter_id=? 
            '''
            cursor.execute(param_sql, param['pid'])
            param_rows = cursor.fetchall()
            for row in param_rows:
                param['data'].append({'date': row[0], 'value': row[1]})

        for param in data:
            param_sql = '''
            select level,threshold from sensor_parameter_attributes where parameter_id=? 
            '''
            cursor.execute(param_sql, param['pid'])
            param_rows = cursor.fetchall()
            for row in param_rows:
                param['sensor_data'].append(
                    {'level': row[0], 'threshold': row[1]})
        return data

    def fetch_data_for_display(self, equipment_id, type):
        if type == 'display':
            sql = '''select  T1.id, T2.id as attr_id, failure_mode_id, name, min_value, max_value, unit, T2.parameter_id,
             level, threshold from (  select id, failure_mode_id, name, min_value, max_value, unit 
             from sensor_based_data where component_id = ?) 
                    as T1 join sensor_parameter_attributes as T2 on T1.id = T2.parameter_id'''
            component_id = equipment_id["id"]
            cursor.execute(sql, component_id)
            data = cursor.fetchall()
            main_data = []
            for row in data:
                main_data.append({"id": row[0], "attr_id": row[1], "failure_mode_id": row[2], "name": row[3],
                                  "min_value": row[4], "max_value": row[5], "unit": row[6],
                                  "level": row[8], "threshold": row[9]})
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
                    sql1 = '''update sensor_based_data set failure_mode_id=?, name=?, min_value=?,
                            max_value=?, unit=? where id=?'''
                    sql2 = '''update sensor_parameter_attributes set level=?, threshold=? where id=?'''

                    cursor.execute(sql1, failure_mode, name,
                                   min_val, max_val, unit, id)
                    cursor.execute(sql2, level, threshold, attr_id)
                    cursor.commit()
                return "Saved Successfully!!"
            except Exception as e:
                return "Not Updated"
        else:
            return self.delete_params(equipment_id)

    def delete_params(self, equipment):
        cid = equipment["id"]
