from dB.dB_connection import cnxn, cursor
import numpy as np
from itertools import groupby
from operator import itemgetter
import pandas as pd
import math
from datetime import datetime
from classes.overhaulsAlgos import OverhaulsAlgos


class Reliability:
    def __init__(self):
        self.success_return = {
            "message": "Data Saved Successfully.", "code": 1}
        self.error_return = {
            "message": "Some Error Occured, Please try agian.",
            "code": 0,
        }
        self.__ship_name = None
        self.__component_name = None
        self.__component_id = None
        self.__rel_F =None

    def lmu_rel(self, mission_name, system, platform, total_dur, c_age=0):
        sys_lmus = []

        system_config = '''select * from system_configuration where ship_name=? and nomenclature=?'''
        
        # TRY ALPHA_BETA FIRST
        alpha_beta = '''select * from alpha_beta inner join system_configuration sc on 
                    alpha_beta.component_id = sc.component_id
                    where sc.nomenclature = ? and sc.ship_name = ?'''
        cursor.execute(alpha_beta, system, platform)
        alpha_beta_data = cursor.fetchall()
        
        # ONLY IF ALPHA_BETA IS EMPTY, TRY ETA_BETA
        eta_beta_data = []
        if len(alpha_beta_data) == 0:
            eta_beta = '''select * from eta_beta inner join system_configuration sc on eta_beta.component_id = sc.component_id
                            where sc.nomenclature = ? and sc.ship_name = ?'''
            cursor.execute(eta_beta, system, platform)
            eta_beta_data = cursor.fetchall()
        
        cursor.execute(system_config, platform, system)
        sys_data = cursor.fetchall()

        lmus_rel = []
        
        # PROCESS ALPHA_BETA DATA (IF AVAILABLE)
        if len(alpha_beta_data) > 0:
            for lmu in alpha_beta_data:
                alpha = lmu[1]
                beta = lmu[2]
                rel = self.calculate_rel_by_power_law(alpha, beta, total_dur)
                lmus_rel.append(
                    {'name': lmu[5], 'id': lmu[4], 'rel': rel, 'parent_name': lmu[9], 'parent_id': lmu[6]})
        
        # ONLY PROCESS ETA_BETA IF ALPHA_BETA WAS EMPTY
        else:
            for lmu in eta_beta_data:
                prev_main_data = '''select maint_date from data_manager_maintenance_data where
                component_id = ? order by CAST(maint_date as date) desc'''
                cursor.execute(prev_main_data, lmu[5])
                first_data = cursor.fetchone()
                ship_id = '''select component_id from system_configuration where ship_name=? and nomenclature=? and parent_id is NULL'''
                cursor.execute(ship_id, platform, system)
                ship_id = cursor.fetchone()[0]
                if first_data is None:
                    opr_sql = '''select avg(average_running) from operational_data where component_id = ?'''
                    cursor.execute(opr_sql, ship_id)
                    c_age = cursor.fetchone()[0]
                else:
                    opr_sql = '''select avg(average_running) from operational_data
                    where component_id = ? and CAST(operation_date as date) > ?'''
                    cursor.execute(opr_sql, ship_id, first_data[0])
                    c_age = cursor.fetchone()[0]
                    if c_age is None:
                        c_age = 0
                eta = lmu[1]
                beta = lmu[2]
                print(
                    "[DEBUG]",
                    "eta =", repr(eta),
                    "beta =", repr(beta),
                    "type(beta) =", type(beta)
                )

                rel_num = np.exp(-((c_age + float(total_dur)) / eta) ** beta)
                rel_deno = np.exp(-(c_age / eta) ** beta)
                rel = float(rel_num) / float(rel_deno)
                lmus_rel.append(
                    {'name': lmu[6], 'id': lmu[5], 'rel': rel, 'parent_name': lmu[10], 'parent_id': lmu[7]})
        
        sys_lmus.append({system+'_'+platform: lmus_rel})
        return sys_lmus, sys_data
    
    def system_rel(self, mission_name, system, platform, total_dur):
        sys_lmus, sys_data = self.lmu_rel(
            mission_name, system, platform, total_dur)
        final_data = [] + sys_lmus[0][system + "_" + platform]
        # all_component_ids = len(sys_data)
        print(final_data)
        self.__rel_F=final_data[0]['rel']
        print(self.__rel_F)

        def inside_func(lmus, system, platform, is_lmu=False):
            current_batch = []
            if is_lmu:
                lmus = list(filter(lambda x: x[system + "_" + platform], lmus))
                lmus = lmus[0][system + "_" + platform]
            parent_grps = groupby(lmus, key=itemgetter("parent_id"))
            parent_grps = set(list(map(lambda b: b[0], parent_grps)))
            for key in parent_grps:
                grp = list(filter(lambda rel: rel["parent_id"] == key, lmus))
                rel = 1
                for r in grp:
                    rel = rel * r["rel"]
                if key is not None:
                    parent = list(filter(lambda x: x[0] == key, sys_data))[0]
                    current_batch.append(
                        {
                            "name": parent[1],
                            "id": key,
                            "parent_name": parent[5],
                            "parent_id": parent[2],
                            "rel": rel,
                        }
                    )
                    # check wheter final data has that element or not
                    ele_exist = list(
                        filter(lambda e: e[1]["id"] ==
                               key, enumerate(final_data))
                    )
                    if len(ele_exist) > 0:
                        ele_index = ele_exist[0][0]
                        final_data[ele_index]["rel"] = (
                            final_data[ele_index]["rel"] * rel
                        )
                    else:
                        final_data.append(
                            {
                                "name": parent[1],
                                "id": key,
                                "parent_name": parent[5],
                                "parent_id": parent[2],
                                "rel": rel,
                            }
                        )
            return current_batch

        current_b = inside_func(sys_lmus, system, platform, True)
        while len(current_b) > 0:
            current_b = inside_func(current_b, system, platform)
            final_data = final_data + current_b

        # Group by on final data.
        # final_grps = groupby(final_data, lambda b: b['id'])
        # final_gs = list(map(lambda b: b[0], final_grps))
        uniq = []
        df = pd.DataFrame(final_data)
        final_grps = df.groupby(by="id")
        return_final_child_data = []
        final_system_rel = {"rel": 1, "child": []}
        for index, gs in final_grps:
            rel = np.prod(gs["rel"].values)
            name = gs.iloc[0]["name"]
            id = gs.iloc[0]["id"]
            parent_name = gs.iloc[0]["parent_name"]
            parent_id = gs.iloc[0]["parent_id"]
            if parent_name == system:
                return_final_child_data.append(
                    {
                        "name": name,
                        "id": id,
                        "rel": rel,
                        "parent_name": parent_name,
                        "parent_id": parent_id,
                    }
                )
            if name == system:
                final_system_rel["rel"] = rel
            if len(gs) > 1:
                pass
        final_system_rel["child"] = return_final_child_data
        return final_system_rel

    def mission_wise_rel(self, missions, eqData, temp_missions):
        final_data = []
        temp_mission_names = list(
            map(lambda x: x["missionName"], temp_missions))
        for m in missions:
            data = {}
            run_simulation = False
            min_total_durr = 0
            max_total_durr = 0
            if m not in temp_mission_names:
                mission_sql = """select * from mission_profile where mission_name =? """
                cursor.execute(mission_sql, m)
                mission = cursor.fetchone()
                target_rel = mission[7]
                # total_dur = 0
                for stage in range(2, 7):
                    split_stage = mission[stage].split("-")
                    if len(split_stage) == 1:
                        min_total_durr = min_total_durr + float(split_stage[0])
                        max_total_durr = max_total_durr + float(split_stage[0])
                    else:
                        min_total_durr = min_total_durr + float(split_stage[0])
                        max_total_durr = max_total_durr + float(split_stage[1])
                if min_total_durr != max_total_durr:
                    run_simulation = True
            else:
                t_m = list(
                    filter(lambda x: x["missionName"] == m, temp_missions))[0]
                stages = t_m["stages"]
                target_rel = float(t_m["tar_rel"])
                for stage in range(0, len(stages)):
                    t_m_durr = list(
                        filter(lambda x: x["missionName"] == m, temp_missions)
                    )[0]["stages"][stage]["duration"]
                    split_stage = t_m_durr.split("-")
                    if len(split_stage) == 1:
                        min_total_durr = min_total_durr + float(split_stage[0])
                        max_total_durr = max_total_durr + float(split_stage[0])
                    else:
                        min_total_durr = min_total_durr + float(split_stage[0])
                        max_total_durr = max_total_durr + float(split_stage[1])
                if min_total_durr != max_total_durr:
                    run_simulation = True
            for sys in eqData:
                system = sys["name"]
                platform = sys["parent"]
                # call the method and save it to a variable
                single_rel_duration = (min_total_durr + max_total_durr) / 2
                rel = self.system_rel(m, system, platform, single_rel_duration)
                estimation_ach = 0
                if run_simulation:
                    count = 0
                    for index in range(0, 100):
                        random_durr = np.random.uniform(
                            min_total_durr, max_total_durr)
                        rel = self.system_rel(m, system, platform, random_durr)
                        if rel["rel"] * 100 >= target_rel:
                            count = count + 1
                    estimation_ach = count / 100
                else:
                    if rel["rel"] > target_rel:
                        estimation_ach = 1
                rel["prob_ac"] = estimation_ach
                if platform not in data:
                    data[platform] = []
                data[platform].append({system: rel})
                pass
            final_data.append({m: data})
        return final_data

    def get_curr_age(self):

        query1 = "SELECT MAX(date) AS last_overhaul_date FROM data_manager_overhaul_maint_data WHERE maintenance_type = 'Corrective Maintenance' and component_id= ?"
        cursor.execute(query1, self.__component_id)
        result1 = cursor.fetchone()

        if result1 is None or result1[0] is None:
            return None, "No data found for the first query."

        last_overhaul_date_str = result1[0]
        last_overhaul_date = datetime.strptime(str(last_overhaul_date_str), "%Y-%m-%d")
        formatted_date = f"{last_overhaul_date.year}-{last_overhaul_date.month:02d}-01"

        query2 = "SELECT SUM(average_running) AS sum_of_average_running FROM operational_data WHERE operation_date <= ? and component_id=?"
        cursor.execute(query2, formatted_date, self.__component_id)
        result2 = cursor.fetchone()

        if result2 is None or result2[0] is None:
            return None, "No data found for the second query."

        sum_of_average_running = result2[0]
        return sum_of_average_running, None

    def estimate_alpha_beta(self, component_id):
        '''CODE TO RE-ESTIMATE ALPHA BETA'''
        subData = []
        try:
            instance = OverhaulsAlgos()
            sub_query = "select * from data_manager_overhauls_info where component_id = ?"
            cursor.execute(sub_query, (component_id,))
            data = cursor.fetchall()
            if not data:
                raise ValueError(
                    f"Time between two overhaul is not defined forgit : {self.__component_name}")
            for item in data:
                formatted_item = {
                    "id": item[0],
                    "overhaulNum": item[2],
                    "numMaint": item[4],
                    "runAge": item[3],
                    "component_id": item[1],
                }
                subData.append(formatted_item)
            if not subData:
                return {"message": f"Time between two overhaul is not defined for: {self.__component_name}", "code": 0}
            run_age_value = list(map(lambda item: item["runAge"], subData))[0]
            success = instance.insert_overhauls_data(
                equipment_id=component_id,
                run_age_component=float(run_age_value),
            )
            # if success is False:
            #     raise ValueError(f"corrective maintenance dates are missing for: {self.__component_name}")
            
            main_query = """SELECT * FROM data_manager_overhaul_maint_data 
                        WHERE component_id = ? ORDER BY cmms_running_age
                """
            cursor.execute(main_query, (component_id,))
            data = cursor.fetchall()
            mainData = []
            for item in data:
                formatted_item = {
                    "id": item[0],
                    "component_id": item[1],
                    "overhaulId": item[2],
                    "date": item[3],
                    "maintenanceType": item[4],
                    "totalRunAge": item[5],
                    "subSystemId": item[6],
                    "runningAge": item[7],
                }
                mainData.append(formatted_item)

            instance.alpha_beta_calculation(mainData, subData, component_id)
        except Exception as e:
            print(e)
            if not subData or success is False:
                raise
            pass

    def get_default_current_age(self):
            query = '''
                SELECT TOP 1 default_curr_age
                FROM data_manager_default_curr_age
                WHERE component_id = ?
                ORDER BY record_date DESC;
            '''
            cursor.execute(query, self.__component_id)
            row = cursor.fetchone()

            # If no data yet, return 0 safely
            return row[0] if row else 0

    def calculate_rel_by_power_law(self, alpha, beta, duration):
        query = """
            SELECT component_id
                FROM system_configuration
                WHERE ship_name = ? COLLATE SQL_Latin1_General_CP1_CS_AS
                AND nomenclature = ? COLLATE SQL_Latin1_General_CP1_CS_AS;
        """
        cursor.execute(query, self.__ship_name, self.__component_name)
        result = cursor.fetchone()
        self.__component_id = result[0]
        # self.estimate_alpha_beta(component_id=self.__component_id)
        sum_of_average_running, error_message = self.get_curr_age()
        if error_message:
            curr_age = self.get_default_current_age()
        else:
            curr_age = sum_of_average_running
        print(f"CURRENT AGE: {curr_age}")
        print(f"ALPHA: {alpha}")
        print(f"BETA: {beta}")
        N_currentAge = alpha * (curr_age**beta)
        missionAge = curr_age + duration
        N_mission = alpha * (missionAge**beta)
        N = N_mission - N_currentAge
        rel = np.e ** (-N)
        print(f"RELIBLITY: {rel}")
        print("*"*100)
        return rel

    def get_DC_EM(
        self, lmuName, component_id=None, system_name=None, platform_name=None
    ):
        """This returns EM and DC values for each LMU"""
        DC_val = 1
        EM_val = 1
        dc_sql = """select duty_cycle from phase_duty_cycle where component_id = ?"""
        if component_id:
            cursor.execute(dc_sql, component_id)
        else:
            component_id_sql = """select component_id from system =? 
                        and ship_name=?, component_name=? and parent_id=? """
            cursor.execute(component_id_sql)
            component_id_data = cursor.fetchone()
            if not component_id_data[0]:
                component_id = component_id_data[0]
                cursor.execute(dc_sql, component_id)

        dc_cycle_data = cursor.fetchone()
        if not dc_cycle_data[0]:
            DC_val = dc_cycle_data[0]

        # Below code is for EM val calculation.
        em_sql = """select life_multiplier from phase_life_multiplier where component_id = ?"""
        if component_id:
            cursor.execute(em_sql, component_id)
        else:
            component_id_sql = """select component_id from system =? 
                        and ship_name=?, component_name=? and parent_id=? """
            cursor.execute(component_id_sql)
            component_id_data = cursor.fetchone()
            if not component_id_data[0]:
                component_id = component_id_data[0]
                cursor.execute(em_sql, component_id)

        em_cycle_data = cursor.fetchone()
        if not em_cycle_data[0]:
            EM_val = em_cycle_data[0]

        return DC_val, EM_val

    def get_HEP(self, lmuName=None, shipName=None, systemName=None):
        pass

    def mission_wise_rel_systemEQ(self, missions, eqData, nomenclatures, temp_missions):
        try:
            final_data = []
            m = "Temp Mission"
            target_rel = 0.9
            for tm in missions:
                data = {}
                for sys in eqData:
                    component = sys["equipmentName"]
                    platform = sys["parent"]
                    instances = [
                        item
                        for item in nomenclatures
                        if item["equipmentName"] == component and item["parent"] == platform
                    ]
                    for e in instances:
                        system = e["nomenclature"]
                        print("*"*100)
                        print(f"COMPONENT NAME: {component}")
                        print(f"SHIP NAME: {platform}")
                        print(f"NOMENCLATURE: {system}")
                        self.__ship_name = platform
                        self.__component_name = system
                        # call the method and save it to a variable
                        query = """
                                SELECT component_id
                                    FROM system_configuration
                                    WHERE ship_name = ? COLLATE SQL_Latin1_General_CP1_CS_AS
                                    AND nomenclature = ? COLLATE SQL_Latin1_General_CP1_CS_AS;
                            """
                        cursor.execute(query, self.__ship_name,
                                       self.__component_name)
                        result = cursor.fetchone()
                        self.__component_id = result[0]
                        self.estimate_alpha_beta(
                            component_id=self.__component_id)
                        single_rel_duration = int(tm)
                        rel = self.system_rel(
                            m, system, platform, single_rel_duration)
                        if rel['rel'] == 1:
                            rel['rel'] = self.__rel_F
                        estimation_ach = 1
                        if rel["rel"] > target_rel:
                            estimation_ach = 1
                        rel["prob_ac"] = estimation_ach 
                        if platform not in data:
                            data[platform] = []
                        rel["equipment"] = component
                        print(rel,"askdkanskdakska")
                        if system not in [list(d.keys())[0] for d in data.get(platform, [])]:
                            data.setdefault(platform, []).append({system: rel})
                final_data.append({m: data})
            self.success_return[
                "message"
            ] = "Reliability displayed successfully"
            self.success_return["results"] = final_data
            return self.success_return

        except Exception as e:
            self.error_return["message"] = str(e)
            return self.error_return
