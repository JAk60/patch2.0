from dB.dB_connection import cnxn, cursor
import numpy as np
from itertools import groupby
from operator import itemgetter
import pandas as pd
import json
import os
from dB.mission_profile import MissionProfile

class TaskReliability:
    # Saving Reliability.
    def lmu_rel(self, mission_name, system, platform, total_dur, c_age=0):
        sys_lmus = []

        
        # mission_name = mission_data['mission_name']
        system_config = '''select * from system_configuration where ship_name=? and system=?'''
        eta_beta = '''select * from eta_beta  inner join system_configuration sc on eta_beta.component_id = sc.component_id
                        where sc.system = ?  and sc.ship_name = ?'''
        cursor.execute(eta_beta, system, platform)
        eta_beta_data = cursor.fetchall()
        alpha_beta_data = []
        if len(eta_beta_data) == 0:
            alpha_beta = '''select * from alpha_beta  inner join system_configuration sc on 
                        alpha_beta.component_id = sc.component_id
                        where sc.system = ?  and sc.ship_name = ?'''
            cursor.execute(alpha_beta, system, platform)
            alpha_beta_data = cursor.fetchall()
        cursor.execute(system_config, platform, system)
        sys_data = cursor.fetchall()

        # lmus = list(filter(lambda x: x['is_lmu'] == 1), sys_data)
        lmus_rel = []
        for lmu in eta_beta_data:
            prev_main_data = '''select maint_date from data_manager_maintenance_data where
              component_id = ? order by CAST(maint_date as date) desc'''
            cursor.execute(prev_main_data, lmu[5])
            first_data = cursor.fetchone()
            ship_id = '''select component_id from system_configuration where ship_name=? and system=? and parent_id is NULL'''
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
            rel_num = np.exp(-((c_age + float(total_dur)) / eta) ** beta)
            rel_deno = np.exp(-(c_age / eta) ** beta)
            rel = rel_num / rel_deno
            lmus_rel.append(
                {'name': lmu[6], 'id': lmu[5], 'rel': rel, 'parent_name': lmu[10], 'parent_id': lmu[7]})
        if len(eta_beta_data) == 0:
            for lmu in alpha_beta_data:
                alpha = lmu[1]
                beta = lmu[2]
                rel = self.calculate_rel_by_power_law(
                    alpha, beta, total_dur)
                lmus_rel.append(
                    {'name': lmu[5], 'id': lmu[4], 'rel': rel, 'parent_name': lmu[9], 'parent_id': lmu[6]})
        sys_lmus.append({system+'_'+platform: lmus_rel})
        return sys_lmus, sys_data

    def system_rel(self, mission_name, system, platform, total_dur, c_age=0):
        sys_lmus, sys_data = self.lmu_rel(
            mission_name, system, platform, total_dur, c_age)
        final_data = [] + sys_lmus[0][system + '_' + platform]
        # all_component_ids = len(sys_data)

        def inside_func(lmus, system, platform, is_lmu=False):
            current_batch = []
            if is_lmu:
                lmus = list(
                    filter(lambda x: x[system + '_' + platform], lmus))
                lmus = lmus[0][system + '_' + platform]
            parent_grps = groupby(lmus, key=itemgetter('parent_id'))
            parent_grps = set(list(map(lambda b: b[0], parent_grps)))
            for key in parent_grps:
                grp = list(filter(lambda rel: rel["parent_id"] == key, lmus))
                rel = 1
                for r in grp:
                    rel = rel*r['rel']
                if key is not None:
                    parent = list(
                        filter(lambda x: x[0] == key, sys_data))[0]
                    current_batch.append({'name': parent[1], 'id': key, 'parent_name': parent[5],
                                          'parent_id': parent[2], 'rel': rel})
                    # check wheter final data has that element or not
                    ele_exist = list(
                        filter(lambda e: e[1]['id'] == key, enumerate(final_data)))
                    if len(ele_exist) > 0:
                        ele_index = ele_exist[0][0]
                        final_data[ele_index]['rel'] = final_data[ele_index]['rel'] * rel
                    else:
                        final_data.append({'name': parent[1], 'id': key, 'parent_name': parent[5],
                                           'parent_id': parent[2], 'rel': rel})
                    # else:
                    #     ele_exist = list(
                    #         filter(lambda e: e[1]['id'] == key, enumerate(final_data)))
                    #     if len(ele_exist) > 0:
                    #         ele_index = ele_exist[0][0]
                    #         final_data[ele_index]['rel'] = final_data[ele_index]['rel'] * rel
                    #     else:
                    #         final_data.append({'name': parent[1], 'id': key, 'parent_name': parent[5],
                    #                            'parent_id': parent[2], 'rel': rel})

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
        final_grps = df.groupby(by='id')
        return_final_child_data = []
        final_system_rel = {'rel': 1, 'child': []}
        for index, gs in final_grps:
            rel = np.prod(gs['rel'].values)
            name = gs.iloc[0]['name']
            id = gs.iloc[0]['id']
            parent_name = gs.iloc[0]['parent_name']
            parent_id = gs.iloc[0]['parent_id']
            if parent_name == system:
                return_final_child_data.append({'name': name, 'id': id, 'rel': rel,
                                                'parent_name': parent_name, 'parent_id': parent_id})
            if name == system:
                final_system_rel['rel'] = rel
            if len(gs) > 1:
                pass
        final_system_rel['child'] = return_final_child_data
        return final_system_rel

    def mission_wise_rel(self, missions, eqData, temp_missions):
        final_data = []
        temp_mission_names = list(
            map(lambda x: x['missionName'], temp_missions))
        for m in missions:
            data = {}
            run_simulation = False
            min_total_durr = 0
            max_total_durr = 0
            if m not in temp_mission_names:
                mission_sql = '''select * from mission_profile where mission_name =? '''
                cursor.execute(mission_sql, m)
                mission = cursor.fetchone()
                target_rel = mission[7]
                # total_dur = 0
                for stage in range(2, 7):
                    split_stage = mission[stage].split('-')
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
                    filter(lambda x: x['missionName'] == m, temp_missions))[0]
                stages = t_m['stages']
                target_rel = float(t_m['tar_rel'])
                for stage in range(0, len(stages)):
                    t_m_durr = list(filter(lambda x: x['missionName'] == m, temp_missions))[
                        0]['stages'][stage]['duration']
                    split_stage = t_m_durr.split('-')
                    if len(split_stage) == 1:
                        min_total_durr = min_total_durr + float(split_stage[0])
                        max_total_durr = max_total_durr + float(split_stage[0])
                    else:
                        min_total_durr = min_total_durr + float(split_stage[0])
                        max_total_durr = max_total_durr + float(split_stage[1])
                if min_total_durr != max_total_durr:
                    run_simulation = True
            for sys in eqData:
                system = sys['name']
                platform = sys['parent']
                # call the method and save it to a variable
                single_rel_duration = (min_total_durr+max_total_durr)/2
                rel = self.system_rel(m, system, platform, single_rel_duration)
                estimation_ach = 0
                if run_simulation:
                    count = 0
                    for index in range(0, 100):
                        random_durr = np.random.uniform(
                            min_total_durr, max_total_durr)
                        rel = self.system_rel(m, system, platform, random_durr)
                        if rel['rel']*100 >= target_rel:
                            count = count + 1
                    estimation_ach = (count/100)
                else:
                    if rel['rel'] > target_rel:
                        estimation_ach = 1
                rel['prob_ac'] = estimation_ach
                if platform not in data:
                    data[platform] = []
                data[platform].append({system: rel})
                pass
            final_data.append({m: data})
        return final_data

    def mission_wise_rel_new(self, missionDataDuration, missionName, eq_data, duration):
        final_data = []
        curr_age = 0
        total_rel = 1
        f_data = {}
        system = eq_data[0]["name"]
        platform = eq_data[0]["parent"]

        for mission_phase in missionDataDuration:
            missionTypeNmae = mission_phase["missionType"]
            duration = float(mission_phase["duration"])    
            rel = self.system_rel(missionName, system, platform, duration, curr_age)
            total_rel *= rel["rel"]
            final_data.append({"system": system, "missionTypeName": missionTypeNmae, "platform": platform, "rel": rel["rel"]*100})
            curr_age += duration
        if platform not in f_data:
            f_data[platform] = []
        f_data[platform].append({system: total_rel})
        return {"main_data": [f_data], "phase_data": final_data}


        
        #     for sys in eqData:
        #         system = sys['name']
        #         platform = sys['parent']
        #         # call the method and save it to a variable
        #         single_rel_duration = (min_total_durr+max_total_durr)/2
        #         rel = self.system_rel(m, system, platform, single_rel_duration)
        #         estimation_ach = 0
        #         if run_simulation:
        #             count = 0
        #             for index in range(0, 100):
        #                 random_durr = np.random.uniform(
        #                     min_total_durr, max_total_durr)
        #                 rel = self.system_rel(m, system, platform, random_durr)
        #                 if rel['rel']*100 >= target_rel:
        #                     count = count + 1
        #             estimation_ach = (count/100)
        #         else:
        #             if rel['rel'] > target_rel:
        #                 estimation_ach = 1
        #         rel['prob_ac'] = estimation_ach
        #         if platform not in data:
        #             data[platform] = []
        #         data[platform].append({system: rel})
        #         pass
        #     final_data.append({m: data})
        # return final_data
    def calculate_rel_by_power_law(self, alpha, beta, duration):
        curr_age = 5000
        N_currentAge = alpha*(curr_age**beta)
        missionAge = curr_age + duration
        N_mission = alpha*(missionAge**beta)
        N = N_mission - N_currentAge
        rel = (np.e**(-N))
        return rel

    def get_DC_EM(self, lmuName, component_id=None, system_name=None, platform_name=None):
        '''This returns EM and DC values for each LMU'''
        DC_val = 1
        EM_val = 1
        dc_sql = '''select duty_cycle from phase_duty_cycle where component_id = ?'''
        if component_id:
            cursor.execute(dc_sql, component_id)
        else:
            component_id_sql = '''select component_id from system =? 
                        and ship_name=?, component_name=? and parent_id=? '''
            cursor.execute(component_id_sql)
            component_id_data = cursor.fetchone()
            if not component_id_data[0]:
                component_id = component_id_data[0]
                cursor.execute(dc_sql, component_id)

        dc_cycle_data = cursor.fetchone()
        if not dc_cycle_data[0]:
            DC_val = dc_cycle_data[0]

        # Below code is for EM val calculation.
        em_sql = '''select life_multiplier from phase_life_multiplier where component_id = ?'''
        if component_id:
            cursor.execute(em_sql, component_id)
        else:
            component_id_sql = '''select component_id from system =? 
                        and ship_name=?, component_name=? and parent_id=? '''
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

    def task_reliability(self, task_name, missionName, missionDataDuration, APP_ROOT, parent):
        target = os.path.join(APP_ROOT, 'tasks/' + task_name + '.json')
        data = json.load(open(target))
        componentData = list(filter(lambda x: x["type"] =="component", data))
        rels = []
        shipRel = {task_name: []}
        for comp in componentData:
            metaData = comp["metaData"]
            parent = metaData["shipName"]
            compName = comp["data"]["label"]
            mission_data = [missionName]
            temp_missions = []
            eq_data = [{'name': compName, 'parent': parent}]
            # Lrel = self.mission_wise_rel(mission_data, eq_data, temp_missions)
            Lrel = self.mission_wise_rel_new(missionDataDuration, missionName, eq_data)
            main_data = Lrel["main_data"]
            phase_data = Lrel["phase_data"]
            Lrel = main_data[0][parent][0][compName]
            comp["rel"] = Lrel
            rels.append({compName :{"child": [], "prob_ac":0, "rel": Lrel}})
        total = self.task_multiply_rel(componentData)
        shipRel[task_name].append({"child": rels, "prob_ac": 0, "rel": total})
        data = [{missionName: shipRel}]
        ## phase data
        p_data = {}
        # final_data.append({"system": system, "missionTypeName": missionTypeNmae, "platform": platform, "rel": rel["rel"]*100})
        # for p in phase_data:
        #     if p["missionTypeName"] not in p_data:
        #         p_data[p["missionTypeName"]] = [p["missionTypeName"], p["rel"], 1]
        #     else:
        #         p_data[p["missionTypeName"]][1] += p["rel"]
        #         p_data[p["missionTypeName"]][2] += 1
        # for key, val in p_data.items():
        #     p_data[key][1] = p_data[key][1]//p_data[key][2]

        return {"main_data":data, "phase_data": phase_data}
    
    def mission_wise_rel_new_dash(self, missionName, eq_data, curr_age, duration):
        system = eq_data[0]["name"]
        platform = eq_data[0]["parent"]
        rel = self.system_rel(missionName, system, platform, duration, curr_age)
        return rel


    def task_new_rel(self, task_name, missionName, missionDataDuration, APP_ROOT, parent):
        
        curr_age = 0
        all_mission_rel = []
        for index,mission in enumerate(missionDataDuration):
            rel_final = []
            missionTypeName = mission["missionType"]
            duration = float(mission["duration"])
            components = mission["components"]
            missionRel = 1
            for comp in components:
                compName = comp["name"]
                eq_data = [{'name': compName, 'parent': parent}]
                if index == 0:
                    Lrel = self.mission_wise_rel_new_dash(missionTypeName, eq_data, curr_age, duration)
                else:
                    prev_missionDurr = missionDataDuration[index - 1]
                    prev_missionDurrComp = prev_missionDurr["components"]
                    prevDur = float(prev_missionDurr["duration"])
                    prev_is_exist = list(filter(lambda x: x["EquipmentId"] == comp["EquipmentId"], prev_missionDurrComp))
                    if len(prev_is_exist) == 0:
                        curr_age = curr_age - prevDur
                    Lrel = self.mission_wise_rel_new_dash(missionTypeName, eq_data, curr_age, duration)
                # main_data = Lrel["main_data"]
                # phase_data = Lrel["phase_data"]
                # Lrel = main_data[0][parent][0][compName]
                rel_final.append({"child": [], "prob_ac":0, "rel": Lrel["rel"], "compName": compName})
                missionRel = missionRel* Lrel["rel"]
            all_mission_rel.append({"missionName": missionTypeName, "rel": missionRel, "comp_rel": rel_final})
            curr_age += duration

        # final_rel = []
        fRel = 1
        for mission in all_mission_rel:
            fRel = fRel * mission["rel"]
        # final_rel.append({"task_name": fRel})

        return {"task_rel": fRel, "all_missionRel": all_mission_rel}







    def task_multiply_rel(self, data):
        total = 1
        parentK = None
        parentN = 2
        only_series = []
        only_parallel = []
        for comp in data:
            compData = comp["data"]
            if "k" not in compData:
                only_series.append(comp)
            else:
                only_parallel.append(comp)

        for l in only_series:
            total = total * l["rel"]
        ############################
        ### TO check for Parallel Systems
        paralel_comp = []
        for comp in only_parallel:
            temp_arr = []
            ###Find Parallel Component
            par_comp = comp["data"]["parallel_comp"]
            for pc in par_comp:
                ####To find id of par_component
                temp_arr.append({'name': pc["label"], 'id': pc["value"]})
            paralel_comp.append(
                {'name': comp["data"]['label'], "par_comp": temp_arr, "id": comp["id"], "k": comp["data"]['k'], "n": comp["data"]['n']})

        ##### Reliability of Parallel
        while (len(paralel_comp) > 0):
            first_item_arr = paralel_comp[0]
            if parentK == None:
                rel_firat_comp = 1 - list(filter(lambda r: r["id"] == first_item_arr['id'], only_parallel))[0][
                        "rel"]
                for p in first_item_arr["par_comp"]:
                    par_comp_rel = list(filter(lambda r: r["id"] == p['id'], only_parallel))[0]["rel"]
                    rel_firat_comp = rel_firat_comp * (1 - par_comp_rel)
                    to_be_remove = list(filter(lambda r: r["id"] == p['id'], paralel_comp))[0]
                    paralel_comp.remove(to_be_remove)
                to_be_remove = list(filter(lambda r: r["id"] == first_item_arr['id'], paralel_comp))[0]
                paralel_comp.remove(to_be_remove)
                total = total * (1 - rel_firat_comp)
                
            else:
                truth_table = list(np.product([0, 1], repeat=int(parentN)))
                truth_table = list(filter(lambda b: b.count(1) >= int(parentK), truth_table))
                add_local_total = 0
                to_be_remove_arr = []
                for main_index, t in enumerate(truth_table):
                    multiply_local_total = 1
                    for index, it in enumerate(t):
                        if index == 0:
                            comp_t = list(filter(lambda r: r["id"] == first_item_arr['id'], only_parallel))[0]
                            if (it == 0):
                                multiply_local_total = multiply_local_total * (1 - comp_t['rel'])
                            else:
                                multiply_local_total = multiply_local_total * comp_t["rel"]
                            if main_index == 0:
                                to_be_remove = list(filter(lambda r: r["id"] == first_item_arr['id'], paralel_comp))[0]
                                to_be_remove_arr.append(to_be_remove)
                        else:
                            comp_t = list(filter(lambda r: r["id"] == first_item_arr['par_comp'][index - 1]['id'],
                                                 only_parallel))[0]
                            if (it == 0):
                                multiply_local_total = multiply_local_total * (1 - comp_t['rel'])
                            else:
                                multiply_local_total = multiply_local_total * comp_t["rel"]
                            if main_index == 0:
                                to_be_remove = list(
                                    filter(lambda r: r["id"] == first_item_arr['par_comp'][index - 1]['id'],
                                           paralel_comp))[0]
                                to_be_remove_arr.append(to_be_remove)
                    add_local_total += multiply_local_total
                total = total * add_local_total
                for r in to_be_remove_arr:
                    paralel_comp.remove(r)
        return total


    def get_task_dropdown_data(self, APP_ROOT):
        # get allmission names
        # get all task data

        target_path = os.path.join(APP_ROOT, 'tasks/')
        files = os.listdir(target_path)
        task_names = []
        taskData = []
        task_ship_names = {}
        for file in files:
            text = file.split(".")
            text = text[0]
            tData, ship_name = self.task_data(os.path.join(target_path, file))
            if ship_name not in task_ship_names:
                task_ship_names[ship_name] = []
            task_ship_names[ship_name].append(text)
            task_names.append({"name": text})
            taskData.append({"task_name": text, "task_data": tData, "ship_name": ship_name})
        mission = MissionProfile()
        data_m = mission.select_mission(toJson=False)
        ship_names = list(task_ship_names.keys())
        f_ship_name = []
        for sN in ship_names:
            f_ship_name.append({"name": sN})
        main_data = {"tasks": task_names, "missionData": data_m, "tasks_data": taskData, 
                     "task_ship_name": task_ship_names, 'ship_name': f_ship_name}

        return main_data
    
    def task_data(self, file_name_path):
        with open(file_name_path, 'r') as f:
            data = json.load(f)
        data = list(filter(lambda x : x["type"] == "component", data))
        ship_name = data[0]["shipName"]
        fData = []
        for d in data:
            id = d["equipementId"]
            name = d["data"]["label"]
            fData.append({"EquipmentId": id, "name": name})
        return fData, ship_name

    def get_eq_id(self, data):
        ship_name = data["shipName"]
        eq_name = data["data"]["label"]
        select = '''select component_id from system_configuration where ship_name=? and system = ?'''
        cursor.execute(select, ship_name, eq_name)
        id_ = cursor.fetchone()[0]
        data["equipementId"] = id_
        return data

