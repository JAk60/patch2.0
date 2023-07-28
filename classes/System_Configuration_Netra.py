from dB.system_configuration.system_configuration_dB import System_Configuration_dB
from dB.dB_connection import cursor, cnxn


class System_Configuration_N():
    def save_dataToDB(self, data, dtype):
        sys_inst = System_Configuration_dB()
        res = ''
        if dtype == 'insertSystem':
            res = sys_inst.insert_system_config(data)
        if dtype == 'insertRedundancy':
            res = sys_inst.insert_redundancy(data)
        if dtype == "failure_mode":
            res = sys_inst.insert_failure_data(data)
        if dtype == 'insertMaintenanceInfo':
            res = sys_inst.insert_maintenance_config(data)
        if dtype == 'additionalInfo':
            res = sys_inst.insert_additional_info(data)
        if dtype == 'insertDutyCycle':
            res = sys_inst.insert_duty_cycle(data)
        return res

    def fetch_component_id(self, platform, system):
        select_sql = '''SELECT component_id FROM system_configuration where ship_name = ? and system = ?'''
        cursor.execute(select_sql, platform, system)
        data = cursor.fetchone()
        return data[0]
    def fetch_system(self, data,component_id):
        failure_data = self.fmodesData(component_id)
        system = data['system']
        ship_name = data['ship_name']
        sql = '''select * from system_configuration as s left join maintenance_configuration_data 
        ab on s.component_id = ab.component_id where s.system=? and s.ship_name=?'''
        cursor.execute(sql, system, ship_name)
        data = cursor.fetchall()
        f_data = []
        if data:
            for r in data:
                f_data.append({
                    'name': r[1],
                    'id': r[0],
                    'eqType': r[3],
                    'parentName': r[5],
                    'parentId': r[2],
                    'parent': r[2],
                    'lmu': r[4],
                    'command': r[9],
                    'department': r[10],
                    'shipCategory': r[7],
                    'shipClass': r[8],
                    'shipName': r[6],
                    'repairType': r[14],
                    'canBeReplacedByShipStaff': r[17],
                    'isSystemParamRecorded': r[18],
                    'pmApplicable': r[15],
                    'pmInterval': r[16]
                })
        else:
            sql = '''select * from system_configuration as s where s.system=? and s.ship_name=?'''
            cursor.execute(sql, system, ship_name)
            data = cursor.fetchall()
            for r in data:
                f_data.append({
                    'name': r[1],
                    'id': r[0],
                    'eqType': r[3],
                    'parentName': r[5],
                    'parentId': r[2],
                    'parent': r[2],
                    'lmu': r[4],
                    'command': r[9],
                    'department': r[10],
                    'shipCategory': r[7],
                    'shipClass': r[8],
                    'shipName': r[6],
                })
        return {"treeD": f_data, "failureMode": failure_data}

    def fetch_failure_modes(self):
        sql = '''select distinct failure_mode from failure_modes'''
        cursor.execute(sql)
        failure_modes = cursor.fetchall()
        fmodes = []
        if failure_modes:
            for f in failure_modes:
                fmodes.append(f[0])
        return fmodes


    def fmodesData(self, component_id):
        sql = '''select * from failure_modes where component_id=?'''
        cursor.execute(sql, (component_id,))  # Ensure component_id is passed as a tuple
        failure_modes = cursor.fetchall()

        # Fetch column names
        columns = [col[0] for col in cursor.description]

        # Convert rows to dictionaries using column names as keys
        fmodes = []
        for f in failure_modes:
            fmodes.append(dict(zip(columns, f)))

        return fmodes