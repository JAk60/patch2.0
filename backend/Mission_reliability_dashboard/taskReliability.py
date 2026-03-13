from backend.Reliability.alpha_beta import AlphaBeta
from dB.dB_connection import cnxn, cursor
import numpy as np
from itertools import groupby
from operator import itemgetter
import pandas as pd
import json
import os
from dB.mission_profile import MissionProfile
from flask import jsonify
from datetime import datetime
import copy
import numpy as np
import pandas as pd
import math
from backend.Mission_reliability_dashboard.taskRelcode import TaskRelCode
from backend.Mission_reliability_dashboard import query
# from backend.Reliability.overhaul_algos import OverhaulsAlgos
from backend.Mission_reliability_dashboard.json_parser import TaskJsonParser

class TaskReliability:

    def __init__(self):
        self.success_return = {"message": "Solution Recommended", "code": 1}
        self.error_return = {"message": "Some Error Occured, Please try again.", "code": 0}
        self.__ship_name = None
        self.__component_name = None
        self.__component_id = None
        self.__rel_F = None
        self.__phase_used_components = {}

    def lmu_rel(self, mission_name, system, platform, total_dur, c_age=0):

        sys_lmus = []
        cursor.execute(query.GET_ALPHA_BETA_JOIN, (system, platform))
        alpha_beta_data = cursor.fetchall()

        eta_beta_data = []
        if len(alpha_beta_data) == 0:
            cursor.execute(query.GET_ETA_BETA_JOIN, (system, platform))
            eta_beta_data = cursor.fetchall()

        cursor.execute(query.GET_SYSTEM_CONFIG, (platform, system))
        sys_data = cursor.fetchall()
        lmus_rel = []

        if len(alpha_beta_data) > 0:

            for lmu in alpha_beta_data:
                alpha = lmu[1]
                beta = lmu[2]
                self.__ship_name = platform
                self.__component_name = system

                rel = self.calculate_rel_by_power_law(
                    alpha,
                    beta,
                    total_dur
                )

                lmus_rel.append({
                    "name": lmu[5],
                    "id": lmu[4],
                    "rel": rel,
                    "parent_name": lmu[9],
                    "parent_id": lmu[6]
                })

        else:

            for lmu in eta_beta_data:
                cursor.execute(query.GET_LAST_MAINT_DATE, (lmu[5],))
                first_data = cursor.fetchone()
                cursor.execute(query.GET_PARENT_SHIP_ID, (platform, system))
                ship_id = cursor.fetchone()[0]

                if first_data is None:
                    cursor.execute(query.GET_AVG_RUNNING, (ship_id,))
                    c_age = cursor.fetchone()[0] or 0
                else:
                    cursor.execute(
                        query.GET_AVG_RUNNING_AFTER_DATE,
                        (ship_id, first_data[0])
                    )
                    c_age = cursor.fetchone()[0] or 0

                eta = lmu[1]
                beta = lmu[2]
                rel_num = np.exp(-((c_age + float(total_dur)) / eta) ** beta)
                rel_deno = np.exp(-(c_age / eta) ** beta)
                rel = float(rel_num) / float(rel_deno)

                lmus_rel.append({
                    "name": lmu[6],
                    "id": lmu[5],
                    "rel": rel,
                    "parent_name": lmu[10],
                    "parent_id": lmu[7]
                })
        sys_lmus.append({system + "_" + platform: lmus_rel})
        return sys_lmus, sys_data


    def get_curr_age(self, component_id):

        cursor.execute(query.GET_LATEST_RUNNING_AGE, (component_id,))
        row = cursor.fetchone()
        if row is None:
            return None
        maintenance_type, running_age = row
        if maintenance_type == "Overhaul":
            return 0.0        
        return float(running_age) if running_age else 0.0

    def fetch_equipment_parameters(self, json_data):
        equipment_ids = {}
        running_ages = {}
        
        for item in json_data:
            if 'data' in item and 'label' in item['data']:
                label = item['data']['label']
                if 'equipementId' in item:
                    equipment_id = item['equipementId']
                    equipment_ids[label] = self.fetch_alpha_beta(equipment_id)
                    running_ages[label] = self.get_curr_age(equipment_id)
        
        return equipment_ids, running_ages

    def calculate_rel_by_power_law(self, alpha, beta, duration):
        instance = AlphaBeta()
        cursor.execute(
            query.GET_COMPONENT_ID,
            (self.__ship_name, self.__component_name)
        )
        result = cursor.fetchone()
        if not result:
            return 0
        self.__component_id = result[0]
        instance.estimate_alpha_beta(
            component_id=self.__component_id,
        )
        curr_age = self.get_curr_age(self.__component_id) or 0

        if self.__component_name in self.__phase_used_components:
            duration_ = self.__phase_used_components[self.__component_name] + duration
            self.__phase_used_components[self.__component_name] = duration_
        else:
            self.__phase_used_components[self.__component_name] = 0

        curr_age += self.__phase_used_components[self.__component_name]
        N_currentAge = alpha * (curr_age ** beta)
        missionAge = curr_age + duration
        N_mission = alpha * (missionAge ** beta)
        N = N_mission - N_currentAge
        rel = np.e ** (-N)

        if self.__phase_used_components[self.__component_name] == 0:
            self.__phase_used_components[self.__component_name] = duration

        return rel


    def fetch_alpha_beta(self, component_id):
        instance = AlphaBeta()
        cursor.execute(query.GET_NOMENCLATURE_BY_ID, (component_id,))
        component_name_tuple = cursor.fetchone()
        if component_name_tuple:
            self.__component_name = component_name_tuple[0]
        instance.estimate_alpha_beta(
            component_id,
        )
        cursor.execute(query.GET_ALPHA_BETA, (component_id,))
        result = cursor.fetchone()
        if result:
            return result[0], result[1]
        return None, None
    
    def task_formatter(self, json_data):
        pass

    def fetch_equipment_parameters(self, json_data):

        equipment_ids = {}
        running_ages = {}

        for item in json_data:
            if 'data' in item and 'label' in item['data']:
                label = item['data']['label']
                if 'equipementId' in item:
                    equipment_id = item['equipementId']
                    equipment_ids[label] = self.fetch_alpha_beta(equipment_id)
                    running_ages[label] = self.get_curr_age(equipment_id)

        return equipment_ids, running_ages

    def json_paraser(self, APP_ROOT, phases, curr_task):
        Taskjson = TaskJsonParser()
        try:
            json_data = Taskjson.load_json(APP_ROOT, curr_task)
            objects_array = Taskjson.extract_components(json_data)
            data = Taskjson.build_label_groups(objects_array)
            data_list = Taskjson.convert_dataframe_to_list(data)
            equipment_ids, running_ages = self.fetch_equipment_parameters(json_data)
            group_inputs = Taskjson.prepare_group_inputs(data_list, equipment_ids, running_ages)

            grouped_result = {}

            for sublist in group_inputs:
                label_group = tuple(sublist[1])
                if label_group in grouped_result:
                    grouped_result[label_group].append(sublist)
                else:
                    grouped_result[label_group] = [sublist]

            final_result = list(grouped_result.values())
            sorted_data = []
            phase_array = [
                "Harbour",
                "Entry Leaving Harbour",
                "Cruise",
                "Defense Station",
                "Action Station"
            ]

            for sublist in final_result:
                sorted_sublist = sorted(
                    sublist,
                    key=lambda x: phase_array.index(x[0])
                )
                sorted_data.append(sorted_sublist)

            groups = sorted_data
            phase_duration = [duration["duration"] for duration in phases]
            phase_seq = []

            for phase in phases:
                for idx, j in enumerate(phase_array):
                    if j == phase["missionType"]:
                        phase_seq.append(idx)

            total_phase = len(phases)
            taskrelcode = TaskRelCode()

            results = {}
            rel = 1

            for i in range(len(groups)):
                for idx, j in enumerate(phase_seq):
                    if groups[i][j][5] == 0:
                        pass
                    else:
                        phase_id = phases[idx]["id"]
                        group_equi_rel, max_rel_equip, group_equip, Rel, max_rel_equip_index = taskrelcode.group_rel(
                            groups[i][j][1],
                            groups[i][j][2],
                            groups[i][j][3],
                            groups[i][j][4],
                            phase_duration[idx],
                            groups[i][j][5],
                            groups[i][j][6]
                        )

                        if phase_id not in results:
                            results[phase_id] = list(set(group_equip))
                        else:
                            results[phase_id].extend(set(group_equip))

                        rel = rel * Rel

                        try:
                            for k in max_rel_equip_index:
                                for l in range(total_phase):
                                    groups[i][l][4][k] += phase_duration[j]
                        except:
                            pass

            self.success_return["recommedation"] = {
                "results": {phase_id: sorted(group_equip)
                            for phase_id, group_equip in results.items()},
                "rel": rel
            }
            return self.success_return
        except Exception as e:
            self.error_return["message"] = str(e)
            return self.error_return

    def system_rel(self, mission_name, system, platform, total_dur, c_age=0):
            sys_lmus, sys_data = self.lmu_rel(
                mission_name, system, platform, total_dur, c_age)
            final_data = [] + sys_lmus[0][system + '_' + platform]
            self.__rel_F = final_data[0]['rel']
            print("----------------------------------->>>>>>>>", final_data)
            

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
                        
                        ele_exist = list(
                            filter(lambda e: e[1]['id'] == key, enumerate(final_data)))
                        if len(ele_exist) > 0:
                            ele_index = ele_exist[0][0]
                            final_data[ele_index]['rel'] = final_data[ele_index]['rel'] * rel
                        else:
                            final_data.append({'name': parent[1], 'id': key, 'parent_name': parent[5],
                                            'parent_id': parent[2], 'rel': rel})

                return current_batch
            current_b = inside_func(sys_lmus, system, platform, True)
            while len(current_b) > 0:
                current_b = inside_func(current_b, system, platform)
                final_data = final_data + current_b
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

                final_system_rel['rel'] = rel
                if len(gs) > 1:
                    pass
            final_system_rel['child'] = return_final_child_data
            return final_system_rel


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
            rel = self.system_rel(missionName, system,
                                  platform, duration, curr_age)
            if rel['rel'] == 1:
                rel['rel'] = self.__rel_F
            print(rel)
            total_rel *= rel["rel"]
            final_data.append({"system": system, "missionTypeName": missionTypeNmae,
                              "platform": platform, "rel": rel["rel"]*100})
            curr_age += duration
        if platform not in f_data:
            f_data[platform] = []
        f_data[platform].append({system: total_rel})
        return {"main_data": [f_data], "phase_data": final_data}

    def mission_wise_rel_new_dash(self, missionName, eq_data, curr_age, duration):
        system = eq_data[0]["name"]
        platform = eq_data[0]["parent"]
        rel = self.system_rel(missionName, system,
                              platform, duration, curr_age)
        return rel
    

    def task_new_rel(self, task_name, missionName, missionDataDuration, APP_ROOT, parent):
        curr_age = 0
        all_mission_rel = []
        for index, mission in enumerate(missionDataDuration):
            rel_final = []
            missionTypeName = mission["missionType"]
            duration = float(mission["duration"])
            components = mission["components"]
            missionRel = 1
            for comp in components:
                compName = comp["name"]
                self.__component_name = compName
                self.__ship_name = parent
                self.__component_id = comp["EquipmentId"]
                eq_data = [{'name': compName, 'parent': parent}]
                if index == 0:
                    Lrel = self.mission_wise_rel_new_dash(
                        missionTypeName, eq_data, curr_age, duration)
                else:
                    prev_missionDurr = missionDataDuration[index - 1]
                    prev_missionDurrComp = prev_missionDurr["components"]
                    prevDur = float(prev_missionDurr["duration"])
                    prev_is_exist = list(
                        filter(lambda x: x["EquipmentId"] == comp["EquipmentId"], prev_missionDurrComp))
                    if len(prev_is_exist) == 0:
                        curr_age = curr_age - prevDur
                    Lrel = self.mission_wise_rel_new_dash(
                        missionTypeName, eq_data, curr_age, duration)
                
                rel_final.append({"child": [], "prob_ac": 0,
                                 "rel": Lrel["rel"], "compName": compName})
                missionRel = missionRel * Lrel["rel"]
            all_mission_rel.append(
                {"missionName": missionTypeName, "rel": missionRel, "comp_rel": rel_final})
            curr_age += duration

        fRel = 1
        for mission in all_mission_rel:
            fRel = fRel * mission["rel"]

        return {"task_rel": fRel, "all_missionRel": all_mission_rel}

    def get_task_dropdown_data(self, APP_ROOT):

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
            taskData.append(
                {"task_name": text, "task_data": tData, "ship_name": ship_name})
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
        data = list(filter(lambda x: x["type"] == "component", data))
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
        print(eq_name)
        select = '''select component_id from system_configuration where ship_name=? and nomenclature = ?'''
        cursor.execute(select, ship_name, eq_name)
        id_ = cursor.fetchone()[0]
        data["equipementId"] = id_
        return data


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
        
        paralel_comp = []
        for comp in only_parallel:
            temp_arr = []
            par_comp = comp["data"]["parallel_comp"]

            for pc in par_comp:
                temp_arr.append({'name': pc["label"], 'id': pc["value"]})
            paralel_comp.append(
                {'name': comp["data"]['label'], "par_comp": temp_arr, "id": comp["id"], "k": comp["data"]['k'], "n": comp["data"]['n']})

        while (len(paralel_comp) > 0):
            first_item_arr = paralel_comp[0]
            if parentK == None:
                rel_firat_comp = 1 - list(filter(lambda r: r["id"] == first_item_arr['id'], only_parallel))[0][
                    "rel"]
                for p in first_item_arr["par_comp"]:
                    par_comp_rel = list(filter(lambda r: r["id"] == p['id'], only_parallel))[
                        0]["rel"]
                    rel_firat_comp = rel_firat_comp * (1 - par_comp_rel)
                    to_be_remove = list(
                        filter(lambda r: r["id"] == p['id'], paralel_comp))[0]
                    paralel_comp.remove(to_be_remove)
                to_be_remove = list(
                    filter(lambda r: r["id"] == first_item_arr['id'], paralel_comp))[0]
                paralel_comp.remove(to_be_remove)
                total = total * (1 - rel_firat_comp)

            else:
                truth_table = list(np.product([0, 1], repeat=int(parentN)))
                truth_table = list(
                    filter(lambda b: b.count(1) >= int(parentK), truth_table))
                add_local_total = 0
                to_be_remove_arr = []
                for main_index, t in enumerate(truth_table):
                    multiply_local_total = 1
                    for index, it in enumerate(t):
                        if index == 0:
                            comp_t = list(
                                filter(lambda r: r["id"] == first_item_arr['id'], only_parallel))[0]
                            if (it == 0):
                                multiply_local_total = multiply_local_total * \
                                    (1 - comp_t['rel'])
                            else:
                                multiply_local_total = multiply_local_total * \
                                    comp_t["rel"]
                            if main_index == 0:
                                to_be_remove = list(
                                    filter(lambda r: r["id"] == first_item_arr['id'], paralel_comp))[0]
                                to_be_remove_arr.append(to_be_remove)
                        else:
                            comp_t = list(filter(lambda r: r["id"] == first_item_arr['par_comp'][index - 1]['id'],
                                                 only_parallel))[0]
                            if (it == 0):
                                multiply_local_total = multiply_local_total * \
                                    (1 - comp_t['rel'])
                            else:
                                multiply_local_total = multiply_local_total * \
                                    comp_t["rel"]
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


    
