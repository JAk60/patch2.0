import uuid
from dB.dB_connection import cursor, cnxn

class OEMData:
    def __init__(self):
        pass

    def upload_data(self, data):
        component_ids = []
        component_failure_modes = []
        component_failure_modes_id = []
        try:
            for d in data:
                component_name = d['name']
                component_id = str(uuid.uuid4())
                parent_id = d['parentId']
                cmms_eq_code = d['eqType']
                is_lmu = d['lmu']
                parent_name = d['parentName']
                command = d['command']
                department = d['department']
                shipCategory = d['shipCategory']
                shipClass = d['shipClass']
                shipName = d['shipName']
                nomenclature = d['nomenclature']
                failure_modes = d["failure_modes"]
                failure_ids = d["failure_mode_ids"]
                component_failure_modes.append(failure_modes)
                component_failure_modes_id.append(failure_ids)
                component_ids.append(component_id)
                insert_system_config = '''insert into system_configuration (component_id, component_name, parent_id, CMMS_EquipmentCode, is_lmu, parent_name, ship_name,
                                    ship_category, ship_class, command, department, nomenclature)
                                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                                                    '''
                cursor.execute(insert_system_config, component_id, component_name,
                                parent_id, cmms_eq_code, is_lmu, parent_name, shipName,
                                shipCategory, shipClass, command, department, nomenclature)
            cursor.commit()
            add_failure_modes(component_failure_modes, component_failure_modes_id, component_ids)
        except Exception as e:
            print(e)
        

    def add_failure_modes(self, component_failure_modes, component_failure_ids, component_ids):
        try:
            insert_failure = '''
                INSERT INTO failure_modes (failure_mode_id, component_id, failure_mode)
                SELECT ?, ?, ?
                WHERE NOT EXISTS (
                    SELECT 1 
                    FROM failure_modes 
                    WHERE component_id = ? AND failure_mode = ?
                );
            '''
            for idx, component_id in enumerate(component_ids):
                failure_modes = component_failure_modes[idx]
                failure_ids = component_failure_ids[idx]
                for i in range(len(failure_modes)):
                    cursor.execute(insert_failure, failure_ids[i],
                                component_id, failure_modes[i], component_id, failure_modes[i])
            
            cursor.commit()
        
        except Exception as e:
            print(e)
        


