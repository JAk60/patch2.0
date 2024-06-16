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
        select_sql = '''SELECT component_id FROM system_configuration where ship_name = ? and nomenclature = ?'''
        cursor.execute(select_sql, platform, system)
        data = cursor.fetchone()
        return data[0]

    def fetch_system(self, data,component_id):
        nomenclature = data['nomenclature']
        ship_name = data['ship_name']
        if component_id is None:
            component_id=self.fetch_component_id(ship_name,nomenclature)
        failure_data = self.fmodesData(component_id)
        sql = '''WITH ComponentHierarchy AS (
                            SELECT s.*
                            FROM system_configuration AS s
                            WHERE s.component_id = ?
                            UNION ALL
                            SELECT s.*
                            FROM system_configuration AS s
                            INNER JOIN ComponentHierarchy AS ch ON s.parent_id = ch.component_id
                        )
                        SELECT s.*, ab.*
                        FROM ComponentHierarchy AS s
                        LEFT JOIN maintenance_configuration_data AS ab ON s.component_id = ab.component_id
                        WHERE s.ship_name = ?;
        '''
        cursor.execute(sql,component_id, ship_name)
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
                    'parent': r[5],
                    'lmu': r[4],
                    'command': r[9],
                    'department': r[10],
                    'shipCategory': r[7],
                    'shipClass': r[8],
                    'shipName': r[6],
                    'repairType': r[15],
                    'canBeReplacedByShipStaff': r[17],
                    'isSystemParamRecorded': r[18],
                    'pmApplicable': r[16],
                    'pmInterval': r[17],
                    'nomenclature': r[11]
                })
        else:
            sql = '''select * from system_configuration as s where s.nomenclature=? and s.ship_name=?'''
            cursor.execute(sql, nomenclature, ship_name)
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
                    'nomenclature': r[-1]
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