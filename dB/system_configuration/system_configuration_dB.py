from dB.system_configuration.system_configurationdB_table import SystemConfigurationdBTable
from dB.dB_connection import cursor, cnxn
from flask import jsonify
from dB.dB_utility import check_component_exist


class System_Configuration_dB():
    def __init__(self):
        SystemConfigurationdBTable()
        self.success_return = {"message": "Data Saved Successfully.",
                               "code": 1}
        self.error_return = {"message": "Some Error Occured, Please try agian.",
                             "code": 0}
        self.system_config_tables_list = ['system_configuration',
                                          'redundancy_data', 'parallel_configuration',
                                          'maintenance_configuration_data', 'failure_modes',
                                          'duty_cycle']

    def insert_system_config(self, data):
        try:
            system_head = list(filter(lambda x: x['parent'] == None, data))[0]['name']
            for system in data:
                component_id = system['id']
                is_exist = self.check_component_exists(component_id)
                if is_exist:
                    self.update_system_config(system)
                else:
                    component_name = system['name']
                    parent_id = system['parentId']
                    cmms_eq_code = system['eqType']
                    is_lmu = system['lmu']
                    parent_name = system['parentName']
                    command = system['command']
                    department = system['department']
                    shipCategory = system['shipCategory']
                    shipClass = system['shipClass']
                    shipName = system['shipName']
                    nomenclature = system['nomenclature']
                    
                    insert_system_config = '''
                        IF NOT EXISTS (
                            SELECT 1
                            FROM system_configuration
                            WHERE nomenclature = ? 
                                AND ship_name = ? 
                                AND department = ?
                        )
                        BEGIN
                            INSERT INTO system_configuration (
                                component_id, 
                                component_name, 
                                parent_id, 
                                CMMS_EquipmentCode, 
                                is_lmu, 
                                parent_name, 
                                ship_name,
                                ship_category, 
                                ship_class, 
                                command, 
                                department, 
                                nomenclature
                            )
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                            SELECT 'Insert successful.' AS message;
                        END
                        ELSE
                        BEGIN
                            SELECT 'Record with the same nomenclature, ship_name, and department already exists.' AS message;
                        END
                    '''

                    cursor.execute(insert_system_config, (nomenclature, shipName, department, component_id, component_name,
                                                        parent_id, cmms_eq_code, is_lmu, parent_name, shipName,
                                                        shipCategory, shipClass, command, department, nomenclature))
                    
                    # Fetch the result after executing the SQL statement
                    result = cursor.fetchone()
                    print(result[0])  # Assuming the message is in the first column of the result

            cursor.commit()
            return self.success_return
        except Exception as e:
            self.error_return['message'] = str(e)
            return self.error_return


    def insert_redundancy(self, system_data):
        insert_redundancy = '''insert into redundancy_data (redundancy_id, 
        component_id, k, n, redundancy_type, system_name, system_parent_name)
        values (?,?,?,?,?,?,?);
          '''

        try:
            for data in system_data:
                redundancy_id = data['id']
                component_id = data['componentId']
                k = data['K']
                n = data['N']
                redundancy_type = data['RedundancyType']
                system_name = data['EquipmentParentName']
                system_parent_name = data['systemName']
                parallel_components = data['parallelComponentIds']
                cursor.execute(insert_redundancy, redundancy_id, component_id, k,
                               n, redundancy_type, system_name,
                               system_parent_name)
                for p_c_id in parallel_components:
                    self.insert_parallel_config(p_c_id, redundancy_id)
            cursor.commit()
            return self.success_return
        except Exception as e:
            self.error_return['message'] = str(e)
            return self.error_return

    def insert_parallel_config(self, component_id, redundancy_id):
        insert_parallel = '''INSERT INTO parallel_configuration 
                            (redundancy_id, component_id)
                            VALUES (?, ?);'''
        cursor.execute(insert_parallel, redundancy_id, component_id)

    def insert_maintenance_config(self, data):
        insert_maintenance = '''insert into maintenance_configuration_data (maintenance_id,
                                component_id, repair_type, pm_applicable, pm_interval,
                                can_be_replaced_by_ship_staff, is_system_param_recorded)
                                VALUES (?, ?, ?, ?, ?, ?,?);'''
        try:
            for d in data:
                maintenance_id = d['id']
                component_id = d['component_id']
                repair_type = d['RepairType']
                pm_applicable = d['PreventiveMaintenaceApplicable']
                pm_interval = float(d['PreventiveMaintenaceInterval'])
                replaced_during_mission = d['ComponentsReplaced']
                is_component_exist = check_component_exist(
                    'maintenance_configuration_data', component_id)
                if is_component_exist:
                    self.update_maintenance_config(d)
                else:
                    cursor.execute(insert_maintenance, (maintenance_id, component_id, repair_type,
                                    pm_applicable, pm_interval, replaced_during_mission, "No"))
            cursor.commit()
            return self.success_return
        except Exception as e:
            self.error_return['message'] = str(e)
            return self.error_return



    def insert_failure_data(self, rows):
        try:
            for data in rows:
                failure_id = data['id']
                component_id = data['eqId']
                failure_mode = data['fixFailureMode']
                # responsible_component = data["rComponent_id"]
                insert_failure = '''
            INSERT INTO failure_modes (failure_mode_id, component_id, failure_mode)
            SELECT ?, ?, ?
            WHERE NOT EXISTS (
            SELECT 1 
            FROM failure_modes 
            WHERE component_id = ? AND failure_mode = ?
                    );
                    '''

                cursor.execute(insert_failure, failure_id,
                            component_id, failure_mode, component_id, failure_mode)
            cnxn.commit()
            return self.success_return
        except Exception as e:
            self.error_return['message'] = 'Failure mode already exists.'
            return self.error_return

    def insert_duty_cycle(self, data):
        try:
            for d in data:
                component_id = d['ComponentId']
                duty_cycle_id = d['id']
                duty_cycle_value = d['DutyCycle']
                insert_duty_cycle = '''INSERT INTO duty_cycle (duty_cycle_id, 
                                        component_id, duty_cycle_value)
                                        VALUES (?, ?, ?);'''

                cursor.execute(insert_duty_cycle, duty_cycle_id,
                               component_id, duty_cycle_value)
            cursor.commit()
            return self.success_return
        except Exception as e:
            self.error_return['message'] = str(e)
            return self.error_return

    def delete_specific_components(self, component_id):
        try:
            for table in self.system_config_tables_list:
                delete_sql = '''delete from {} where component_id = {}'''.format(
                    table, component_id)
                cursor.execute(delete_sql)
            cursor.commit()
            return self.success_return
        except Exception as e:
            self.error_return['message'] = str(e)
            return self.error_return

    def update_system_config(self, system):
        component_id = system['id']
        component_name = system['name']
        parent_id = system['parentId']
        part_code = system['eqType']
        is_lmu = system['lmu']
        parent_name = system['parentName']
        update_sql = '''update system_configuration set component_name=?,
                        part_code=?, is_lmu=? where component_id=?'''
        try:
            cursor.execute(update_sql, component_name,
                           part_code, is_lmu, component_id)
            cursor.commit()
            self.success_return
        except Exception as e:
            self.error_return['message'] = str(e)
            return self.error_return

    def update_redundancy(self, data):
        redundancy_id = data['id']
        component_id = data['componentId']
        hK = data['hK']
        elhk = data['elhK']
        cK = data['cK']
        dsK = data['dsK']
        asK = data['asK']
        n = data['n']
        redundancy_type = data['RedundancyType']
        parallel_components = data['parellel_component']
        update_sql = '''update redundancy_data set
                        harbour_k=?, n=?, redundancy_type=?, ELH_K=?, cruise_k=?, defence_k,
                        action_k=?
                        where component_id=? and redundancy_id=?'''
        try:
            cursor.execute(update_sql, hK, n, redundancy_type, elhk, cK, dsK, asK,
                           component_id, redundancy_id)
            self.update_parallel(redundancy_id, parallel_components)
            self.success_return
        except Exception as e:
            self.error_return['message'] = str(e)
            return self.error_return

    def update_parallel(self, id, parallel_component):
        """As there are multiple rows for same id, delete and then insert"""
        delete_sql = '''delete parallel_configuration where redundancy_id=?'''
        try:
            cursor.execute(delete_sql, id)
            for p_c in parallel_component:
                self.insert_parallel_config(p_c, id)
            self.success_return
        except Exception as e:
            self.error_return['message'] = str(e)
            return self.error_return

    def update_maintenance_config(self, d):
        maintenance_id = d['id']
        component_id = d['component_id']
        repair_type = d['RepairType']
        pm_applicable = d['PreventiveMaintenaceApplicable']
        pm_interval = d['PreventiveMaintenaceInterval']
        replaced_during_mission = d['ComponentsReplaced'] 
        update_sql = '''UPDATE maintenance_configuration_data SET repair_type=?, 
                        pm_applicable=?, pm_interval=?, is_system_param_recorded=?, 
                        can_be_replaced_by_ship_staff=? WHERE component_id=?'''
        try:
            # Assuming 'cursor' and 'conn' are defined earlier in your code
            cursor.execute(update_sql, (repair_type, pm_applicable, pm_interval, "No", replaced_during_mission, component_id))
            cursor.commit()  # Commit the transaction
            return self.success_return
        except Exception as e:
            self.error_return['message'] = str(e)
            return self.error_return



    def update_failure(self, data):
        failure_id = data['failure_id']
        failure_mode = data['failure_mode']
        update_sql = '''update failure_modes set failure_mode=? where failure_id=?'''
        try:
            cursor.execute(update_sql, failure_mode, failure_id)
            cursor.commit()
            return self.success_return
        except Exception as e:
            self.error_return['message'] = str(e)
            return self.error_return

    def update_duty_cycle(self, data):
        component_id = data['component_id']
        duty_cycle_id = data['duty_cycle_id']
        duty_cycle_value = data['duty_cycle_value']
        update_sql = '''update duty_cycle set duty_cycle_value=? where duty_cycle_id=?'''
        try:
            cursor.execute(update_sql, duty_cycle_value, duty_cycle_id)
            cursor.commit()
            return self.success_return
        except Exception as e:
            self.error_return['message'] = str(e)
            return self.error_return

    def check_component_exists(self, component_id):
        check_sql = '''select component_id from system_configuration where component_id = ?'''
        cursor.execute(check_sql, component_id)
        exist = cursor.fetchone()
        if exist:
            return True
        else:
            False

    def insert_additional_info(self, data):
        insert_sql = '''insert into system_config_additional_info (id, component_id, 
                        component_name, num_cycle_or_runtime, installation_date,
                        unit, harbour_k, elh_k, cruise_k, defense_k, action_k,
                        maint_data_availability)
                        values (?,?,?,?,?,?,?,?,?,?,?,?)'''
        try:
            for d in data:
                id = d['id']
                comp_id = d['component_id']
                name = d['EquipmentName']
                run_cycle = d['AverageRunning']
                installation_date = d["installation_date"]
                unit = d['Unit']
                harbour_k = d['hK']
                n = d['N']
                elh_k = d['elhK']
                cruise_k = d['cK']
                defence_k = d['dsK']
                action_k = d['asK']
                maint_data_avail = d['maintDataAvail']
                parallel_compoment = d["parallelComponentIds"]
                is_comp_exist = check_component_exist(
                    'system_config_additional_info', comp_id)
                if is_comp_exist:
                    self.update_additional_info(d)
                else:
                    cursor.execute(insert_sql, id, comp_id, name,
                                   run_cycle, installation_date, unit,
                                   harbour_k, elh_k, cruise_k, defence_k, action_k, maint_data_avail)
                for p_id in parallel_compoment:
                    self.insert_parallel_config_additional(p_id, id)
            cnxn.commit()
            return self.success_return
        except:
            return self.error_return

    def insert_parallel_config_additional(self, component_id, id):
        insert_parallel = '''insert into system_config_additional_info_parallel 
        (id, component_id) values (?,?)'''
        cursor.execute(insert_parallel, id, component_id)

    def update_additional_info(self, data):
        id = data['id']
        comp_id = data['component_id']
        name = data['EquipmentName']
        run_cycle = data['AverageRunning']
        installation_date = data["installation_date"]
        unit = data['Unit']
        update_sql = '''update system_config_additional_info set num_cycle_or_runtime = ?,
                         installation_date =? , unit =? where component_id =?'''
        cursor.execute(update_sql, run_cycle, installation_date, unit, comp_id)
