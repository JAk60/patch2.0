from dB.dB_connection import cursor, cnxn
from dB.maintenance_allocation.maintenanceAllocationdB_table import maintenanceAllocationdB_Table

from uuid import uuid4


class maintenanceAllocation_dB():
    def __init__(self):
        maintenanceAllocationdB_Table()
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
        # if dtype == 'insertComponentLevel':
        #     res = self.insert_component_level(data)
        # if dtype == 'insertExtFactors':
        #     res = self.insert_ext_factors(data)
        # if dtype == 'insertLifeMultiplier':
        #     res = self.insert_life_multiplier(data)
        return res

    def insert_sensor(self, data):
        #print(data)
        # try:
        for d in data:

            component_id = d['ComponentId']
            equipment_id = d['EquipmentId']
            id = d['id']
            failure_mode_id=d['FailureModeId']
            name = d['name']
            frequency = d['frequency']
            unit=d['unit']
            min_value =d['min']
            max_value =d['max']
            param_data =d['data']
            level =d['level']
            
            insert_sensor_based = '''INSERT INTO sensor_based_data (id, component_id,equipment_id, name,
                            failure_mode_id,frequency,unit, min_value,max_value,data,level)
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'''

            cursor.execute(insert_sensor_based, id, component_id, equipment_id, name,failure_mode_id,
                            frequency, unit, min_value,max_value,param_data,level)
        cursor.commit()
        return self.success_return
        # except Exception as e:
        #     print(e)
        #     self.error_return['message'] = str(e)
        #     return self.error_return

    def insert_sensor_param_attributes(self, data):
        #print(data)
        # try:
        for d in data:

            parameter_id = d['pid']
            id = d['id']
            threshold=d['threshold']
            level =d['level']
            
            insert_spa = '''INSERT INTO sensor_parameter_attributes (id, parameter_id,
                            level,threshold)
                                    VALUES (?, ?, ?, ?);'''

            cursor.execute(insert_spa, id, parameter_id,level,threshold)
        cursor.commit()
        return self.success_return
        # except Exception as e:
        #     print(e)
        #     self.error_return['message'] = str(e)
        #     return self.error_return

    def insert_sensor_alarm(self, data):
       
        for d in data:
            id=d['id']
            alarm = d['alarm']
            
            insert_sensor_alarm = '''INSERT INTO sensor_alarm_data (id, alarm)
                                    VALUES (?, ?);'''

            cursor.execute(insert_sensor_alarm, id, alarm)
        cursor.commit()
        return self.success_return


    def insert_sensor_alarm_attributes(self, data):
        #print(data)
        # try:
        for d in data:

            alarm_id = d['AlarmId']
            id = d['id']
            parameter_id=d['paramId']
            level_id =d['lvlId']
            
            insert_apa = '''INSERT INTO sensor_alarm_attributes (id, alarm_id,
                            parameter_id,level_id)
                                    VALUES (?, ?, ?, ?);'''

            cursor.execute(insert_apa, id, alarm_id,parameter_id,level_id)
        cursor.commit()
        return self.success_return
        # except Exception as e:
        #     print(e)
        #     self.error_return['message'] = str(e)
        #     return self.error_return
  