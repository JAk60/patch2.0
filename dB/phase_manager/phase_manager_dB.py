from dB.dB_connection import cursor, cnxn
from uuid import uuid4


class Phase_Manager_dB():
    def __init__(self):
        self.success_return = {"message": "Data Saved Successfully.",
                               "code": 1}
        self.error_return = {"message": "Some Error Occured, Please try agian.",
                             "code": 0}

    def save_dataToDB(self, data, dtype):
        res = ''
        if dtype == 'insertPhase':
            res = self.insert_phase_manager(data)
        if dtype == 'insertLifeMultiplier':
            res = self.insert_life_multiplier(data)
        if dtype == 'insertDCMultiplier':
            res = self.insert_duty_cycle(data)
        return res

    def insert_phase_manager(self, data):
        try:
            for d in data:
                component_id = d['ComponentId']
                phase_id = d['id']
                phase_name = d['PhaseName']
                type = d['MeasurementType']
                unit = d['Unit']
                lower_bound = d['LowerBound']
                upper_bound = d['UpperBound']
                phase_range = d['PhaseRange']
                desc = d['Description']
                insert_phase = '''INSERT INTO phase_definition (phase_id, 
                        component_id, phase_name,type,unit,lower_bound,upper_bound,phase_range, description)
                                        VALUES (?, ?, ?, ?, ?, ?, ?,?, ?);'''

                cursor.execute(insert_phase, phase_id, component_id, phase_name,
                               type, unit, lower_bound, upper_bound, phase_range, desc)
            cursor.commit()
            return self.success_return
        except Exception as e:
            self.error_return['message'] = str(e)
            return self.error_return

    def insert_life_multiplier(self, data):
        insert_sql = '''insert into phase_life_multiplier (id, phase_id, component_id, life_multiplier)
                        values (?,?,?,?)'''
        try:
            for d in data:
                component_id = d['component_id']
                objectKeys = list(d.keys())
                objectKeys.remove('component_id')
                objectKeys.remove('Component')
                for key in objectKeys:
                    life_multi_val = d[key]
                    phase_id = key.split(" ")[-1]
                    id = uuid4()
                    cursor.execute(insert_sql, id, phase_id,
                                   component_id, life_multi_val)
            cursor.commit()
            return self.success_return
        except Exception as e:
            self.error_return['message'] = str(e)
            return self.error_return

    def insert_duty_cycle(self, data):
        insert_sql = '''insert into phase_duty_cycle (id, phase_id, component_id, duty_cycle)
                        values (?,?,?,?)'''
        try:
            for d in data:
                component_id = d['component_id']
                objectKeys = list(d.keys())
                objectKeys.remove('component_id')
                objectKeys.remove('Component')
                for key in objectKeys:
                    duty_cycle = d[key]
                    phase_id = key.split(" ")[-1]
                    id = uuid4()
                    cursor.execute(insert_sql, id, phase_id,
                                   component_id, duty_cycle)
            cursor.commit()
            return self.success_return
        except Exception as e:
            self.error_return['message'] = str(e)
            return self.error_return

    def fetch_phases(self, data):
        system = data['system']
        ship_name = data['ship_name']
        select_comp_id = '''select component_id from system_configuration where system=? and 
        ship_name=? and component_name=?'''
        cursor.execute(select_comp_id, system, ship_name, system)
        system_config_row = cursor.fetchone()
        phase_data = []
        try:
            component_id = system_config_row[0]
            select_phases = '''select * from phase_definition where component_id=?'''
            cursor.execute(select_phases, component_id)
            p_data = cursor.fetchall()
            for p in p_data:
                phase_data.append({
                    'id': p[0],
                    'component_id': p[1],
                    'PhaseName': p[2],
                    'MeasurementType': p[3],
                    'Unit': p[4],
                    'LowerBound': p[5],
                    'UpperBound': p[6],
                    'PhaseRange': p[7],
                    'Description': p[8]
                })
            return phase_data
        except:
            return phase_data
