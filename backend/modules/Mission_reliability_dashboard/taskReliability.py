from backend.modules.Reliability.alpha_beta import AlphaBeta
from backend.dB.dB_connection import cnxn, cursor
import numpy as np
import json
import os
from backend.modules.Mission_reliability_dashboard.mission_profile import MissionProfile
from flask import jsonify
from datetime import datetime
import copy
import math
from backend.modules.Mission_reliability_dashboard.taskRelcode import TaskRelCode
from backend.dB.mission_reliability_dashboard import query
from backend.modules.Mission_reliability_dashboard.json_parser import TaskJsonParser
import pandas as pd 
from itertools import groupby
from operator import itemgetter
import numpy as np


class TaskReliability:

    def __init__(self):
        self.__ship_name = None
        self.__component_name = None
        self.__component_id = None
        self.__rel_F = None
        self.__phase_used_components = {}

    def _fresh_success(self):
        return {"message": "Solution Recommended", "code": 1}

    def _fresh_error(self):
        return {"message": "Some Error Occurred, Please try again.", "code": 0}

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
                rel = self.calculate_rel_by_power_law(alpha, beta, total_dur)
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
                    cursor.execute(query.GET_AVG_RUNNING_AFTER_DATE, (ship_id, first_data[0]))
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
        cursor.execute(query.GET_COMPONENT_ID, (self.__ship_name, self.__component_name))
        result = cursor.fetchone()
        if not result:
            return 0
        self.__component_id = result[0]
        instance.estimate_alpha_beta(component_id=self.__component_id)
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
        instance.estimate_alpha_beta(component_id)
        cursor.execute(query.GET_ALPHA_BETA, (component_id,))
        result = cursor.fetchone()
        if result:
            return result[0], result[1]
        return None, None

    def task_formatter(self, json_data):
        pass

    def get_ops_map(self, ship_name):
        cursor.execute(query.GET_QUERY_OPS, (ship_name,))
        rows = cursor.fetchall()
        return {row[0]: row[1] for row in rows}

    def _build_groups(self, APP_ROOT, task_name):
        
        Taskjson = TaskJsonParser()
        json_data = Taskjson.load_json(APP_ROOT, task_name)
        objects_array = Taskjson.extract_components(json_data)
        data = Taskjson.build_label_groups(objects_array)
        data_list = Taskjson.convert_dataframe_to_list(data)
        equipment_ids, running_ages = self.fetch_equipment_parameters(json_data)
        group_inputs = Taskjson.prepare_group_inputs(data_list, equipment_ids, running_ages)

        grouped_result = {}
        for sublist in group_inputs:
            label_group = tuple(sublist[1])
            grouped_result.setdefault(label_group, []).append(sublist)
        final_result = list(grouped_result.values())

        phase_array = [
            "Harbour",
            "Entry Leaving Harbour",
            "Cruise",
            "Defense Station",
            "Action Station"
        ]
        phase_index_map = {name: i for i, name in enumerate(phase_array)}

        sorted_data = []
        for sublist in final_result:
            sorted_sublist = sorted(
                sublist,
                key=lambda x: phase_index_map.get(x[0], 0)
            )
            sorted_data.append(sorted_sublist)

        return sorted_data, phase_array, phase_index_map


    def _resolve_ops_sets(self, ops_map):
        has_any_true = any(v for v in ops_map.values() if v is not None)
        if not has_any_true:
            return set(ops_map.keys()), set()
        active_set = {k for k, v in ops_map.items() if v}
        non_active_set = {k for k, v in ops_map.items() if not v}
        return active_set, non_active_set


    def _filter_group_entry(self, group_entry, allowed_names, phase_array, phase_index):

        components  = group_entry[1]
        alpha_beta  = group_entry[2]
        running_age = group_entry[3]
        extra_data  = group_entry[4]
        original_k  = group_entry[5]

        active_components  = []
        active_alpha_beta  = []
        active_running_age = []
        active_indices     = []
        non_ops_in_group   = []

        for idx_c, comp in enumerate(components):
            if comp in allowed_names:
                active_indices.append(idx_c)
                active_components.append(comp)
                active_alpha_beta.append(alpha_beta[idx_c])
                active_running_age.append(running_age[idx_c])
            else:
                non_ops_in_group.append(comp)

        original_n = len(components)
        new_n = len(active_components)

        if active_alpha_beta and isinstance(active_alpha_beta[0], (list, tuple)):
            active_alpha = [ab[0] if ab[0] is not None else 0.0 for ab in active_alpha_beta]
            active_beta  = [ab[1] if ab[1] is not None else 1.0 for ab in active_alpha_beta]
        else:
            active_alpha = [a if a is not None else 0.0 for a in active_alpha_beta]
            active_beta  = [b if b is not None else 1.0 for b in active_running_age]
            active_running_age = [
                extra_data[idx_c] if idx_c < len(extra_data) else 0.0
                for idx_c in active_indices
            ]

        return (
            active_components, active_alpha, active_beta, active_running_age,
            active_indices, non_ops_in_group, original_n, new_n, original_k
        )

    def json_parser(self, APP_ROOT, phases, curr_task, ship_name):
        self.__phase_used_components = {}
        taskrelcode = TaskRelCode()

        try:
            groups, phase_array, phase_index_map = self._build_groups(APP_ROOT, curr_task)
            phase_duration = [phase["duration"] for phase in phases]
            phase_seq = []
            for phase in phases:
                for idx, j in enumerate(phase_array):
                    if j == phase["missionType"]:
                        phase_seq.append(idx)

            print("phase_seq:", phase_seq)
            print("groups length:", len(groups))
            print("ship_name:", ship_name)

            ops_map = self.get_ops_map(ship_name)
            print("ops_map raw:", ops_map)

            active_set, non_active_set = self._resolve_ops_sets(ops_map)
            results = {}
            rel = 1

            for i in range(len(groups)):
                for idx, j in enumerate(phase_seq):
                    if j >= len(groups[i]):
                        continue
                    if groups[i][j][5] == 0:
                        continue

                    phase_name = groups[i][j][0] if groups[i][j][0] else phase_array[j]

                    (
                        active_components, active_alpha, active_beta, active_running_age,
                        active_indices, non_ops_in_group,
                        original_n, new_n, original_k
                    ) = self._filter_group_entry(groups[i][j], active_set, phase_array, j)

                    if not active_components:
                        print(f"  Skipping group {i} phase {phase_name}: no ops components found")
                        continue

                    if original_k > new_n:
                        raise ValueError(
                            f"Cannot proceed: k={original_k} exceeds available ops components "
                            f"n={new_n} in phase '{phase_name}'. "
                            f"Non-ops components in this group: {non_ops_in_group}"
                        )

                    print(f"\n  Phase: {phase_name}")
                    print(f"  Nomenclature (all):   {groups[i][j][1]}")
                    print(f"  Nomenclature (ops):   {active_components}")
                    print(f"  original_n={original_n}, new_n={new_n}, original_k={original_k}")

                    if idx >= len(phases):
                        print(f"  Skipping: idx={idx} out of range for phases")
                        continue

                    phase_id = phases[idx]["id"]

                    try:
                        group_equi_rel, max_rel_equip, group_equip, Rel, max_rel_equip_index = taskrelcode.group_rel(
                            active_components,
                            active_alpha,
                            active_beta,
                            active_running_age,
                            phase_duration[idx],
                            original_k,
                            new_n
                        )
                    except Exception as e:
                        print(f"  group_rel failed for group {i}, phase_seq {j}: {e}")
                        continue

                    if group_equip is None:
                        print(f"  group_equip is None for group {i}, skipping")
                        continue

                    rel *= Rel

                    if phase_id not in results:
                        results[phase_id] = {
                            "components": set(),
                            "ops_components": set(active_components),
                            "updated_k": original_k,
                            "updated_n": new_n
                        }
                    results[phase_id]["components"].update(group_equip)

                    try:
                        for k in max_rel_equip_index:
                            if k >= len(active_indices):
                                continue
                            original_k_index = active_indices[k]
                            for l in range(len(groups[i])):
                                if original_k_index < len(groups[i][l][4]):
                                    groups[i][l][4][original_k_index] += phase_duration[idx]
                    except Exception as e:
                        print("  Error in update block:", e)

            return {
                "message": "Solution Recommended",
                "code": 1,
                "Non_ops_equipment": sorted(list(non_active_set)),
                "ops_equipment": sorted(list(active_set)),
                "recommedation": {
                    "results": {
                        pid: {
                            "components": sorted(list(data["components"])),
                            "ops_components": sorted(list(data["ops_components"])),
                            "updated_k": data["updated_k"],
                            "updated_n": data["updated_n"]
                        }
                        for pid, data in results.items()
                    },
                    "rel": float(rel)
                }
            }

        except Exception as e:
            import traceback
            traceback.print_exc()
            print("ERROR:", str(e))
            return {"message": str(e), "code": 0}

    def task_new_rel(self, task_name, missionName, missionDataDuration,
                     APP_ROOT, parent, user_selected_names=None):

        taskrelcode = TaskRelCode()
        self.__phase_used_components = {}

        try:
            ops_map = self.get_ops_map(parent)
            print("ops_map raw:", ops_map)
            active_set, non_active_set = self._resolve_ops_sets(ops_map)
            print("active_set:", active_set)

            if user_selected_names and len(user_selected_names) > 0:
                if isinstance(user_selected_names, list):
                    cleaned = []
                    for item in user_selected_names:
                        if isinstance(item, dict):
                            cleaned.append(item.get("label") or item.get("name"))
                        else:
                            cleaned.append(item)
                    user_set = set(cleaned)
                else:
                    user_set = set()

                invalid = user_set - active_set
                if invalid:
                    raise ValueError(
                        f"Cannot proceed: user selected non-ops (inactive) equipment: "
                        f"{sorted(invalid)}. These components are marked non-operational."
                    )
                allowed_names = user_set  
            else:
                allowed_names = active_set

            print("allowed_names (effective selection):", allowed_names)

            groups, phase_array, phase_index_map = self._build_groups(APP_ROOT, task_name)
            phase_duration = [float(phase["duration"]) for phase in missionDataDuration]
            phase_seq = []
            for phase in missionDataDuration:
                for idx, j in enumerate(phase_array):
                    if j == phase["missionType"]:
                        phase_seq.append(idx)

            print("phase_seq:", phase_seq)
            print("groups length:", len(groups))
            print("parent:", parent)

            rel = 1
            phase_rel_accumulator = {}

            for i in range(len(groups)):
                for idx, j in enumerate(phase_seq):
                    if j >= len(groups[i]):
                        continue
                    if groups[i][j][5] == 0:
                        continue

                    phase_name = groups[i][j][0] if groups[i][j][0] else phase_array[j]
                    (
                        active_components, active_alpha, active_beta, active_running_age,
                        active_indices, non_ops_in_group,
                        original_n, new_n, original_k
                    ) = self._filter_group_entry(groups[i][j], allowed_names, phase_array, j)

                    if not active_components:
                        print(f"  Skipping group {i} phase {phase_name}: no allowed components found")
                        continue

                    if original_k > new_n:
                        raise ValueError(
                            f"Cannot proceed: k={original_k} exceeds available selected components "
                            f"n={new_n} in phase '{phase_name}'. "
                            f"You must select at least {original_k} components from this group. "
                            f"Excluded components: {non_ops_in_group}"
                        )

                    print(f"\n  Phase: {phase_name}")
                    print(f"  Nomenclature (all):   {groups[i][j][1]}")
                    print(f"  Nomenclature (allowed): {active_components}")
                    print(f"  original_n={original_n}, new_n={new_n}, original_k={original_k}")
                    print("USER SELECTED:", active_components)
                    if idx >= len(missionDataDuration):
                        print(f"  Skipping: idx={idx} out of range for missionDataDuration")
                        continue

                    try:
                        if user_selected_names:
                            Rel,group_equi_rel=taskrelcode.user_group_rel(
                                        active_alpha,
                                        active_beta,
                                        active_running_age,
                                        phase_duration[idx],
                                        original_k,
                                        new_n
                            )
                            group_equip = active_components
                            max_rel_equip_index = list(range(len(active_components)))

 
                    except Exception as e:
                        print(f"  group_rel failed for group {i}, phase {phase_name}: {e}")
                        continue

                    if group_equip is None:
                        print(f"  group_equip is None for group {i}, skipping")
                        continue

                    rel *= Rel

                    phase_key = missionDataDuration[idx]["missionType"]
                    if phase_key not in phase_rel_accumulator:
                        phase_rel_accumulator[phase_key] = {"rel": 1.0, "comp_rel": []}
                    phase_rel_accumulator[phase_key]["rel"] *= Rel
                    
                    for ci, name in enumerate(active_components):
                        phase_rel_accumulator[phase_key]["comp_rel"].append({
                            "child":    [],
                            "prob_ac":  0,
                            "rel":      group_equi_rel[ci] if ci < len(group_equi_rel) else 0,
                            "compName": name
                        })

                        print("GROUP REL OUTPUT:", group_equip)
                    try:
                        for k in max_rel_equip_index:
                            if k >= len(active_indices):
                                continue
                            original_k_index = active_indices[k]
                            for l in range(len(groups[i])):
                                if original_k_index < len(groups[i][l][4]):
                                    groups[i][l][4][original_k_index] += phase_duration[idx]
                    except Exception as e:
                        print(f"  Age accumulation error in group {i}, phase {phase_name}: {e}")

            all_mission_rel = [
                {
                    "missionName": phase_key,
                    "rel":         data["rel"],
                    "comp_rel":    data["comp_rel"]
                }
                for phase_key, data in phase_rel_accumulator.items()
            ]
            print("Returning task_new_rel with rel:", rel)
            return {"task_rel": float(rel), "all_missionRel": all_mission_rel}
        
        except Exception as e:
            import traceback
            traceback.print_exc()
            print("ERROR in task_new_rel:", str(e))
            return {"task_rel": 0, "all_missionRel": [], "error": str(e)}

    def system_rel(self, mission_name, system, platform, total_dur, c_age=0):
        sys_lmus, sys_data = self.lmu_rel(mission_name, system, platform, total_dur, c_age)
        final_data = [] + sys_lmus[0][system + '_' + platform]
        self.__rel_F = final_data[0]['rel']
        print("----------------------------------->>>>>>>>", final_data)

        def inside_func(lmus, system, platform, is_lmu=False):
            current_batch = []
            if is_lmu:
                lmus = list(filter(lambda x: x[system + '_' + platform], lmus))
                lmus = lmus[0][system + '_' + platform]
            parent_grps = groupby(lmus, key=itemgetter('parent_id'))
            parent_grps = set(list(map(lambda b: b[0], parent_grps)))
            for key in parent_grps:
                grp = list(filter(lambda rel: rel["parent_id"] == key, lmus))
                rel = 1
                for r in grp:
                    rel = rel * r['rel']
                if key is not None:
                    parent = list(filter(lambda x: x[0] == key, sys_data))[0]
                    current_batch.append({
                        'name': parent[1],
                        'id': key,
                        'parent_name': parent[5],
                        'parent_id': parent[2],
                        'rel': rel
                    })
                    ele_exist = list(filter(lambda e: e[1]['id'] == key, enumerate(final_data)))
                    if len(ele_exist) > 0:
                        ele_index = ele_exist[0][0]
                        final_data[ele_index]['rel'] = final_data[ele_index]['rel'] * rel
                    else:
                        final_data.append({
                            'name': parent[1],
                            'id': key,
                            'parent_name': parent[5],
                            'parent_id': parent[2],
                            'rel': rel
                        })
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
                return_final_child_data.append({
                    'name': name,
                    'id': id,
                    'rel': rel,
                    'parent_name': parent_name,
                    'parent_id': parent_id
                })
            final_system_rel['rel'] = rel
            if len(gs) > 1:
                pass

        final_system_rel['child'] = return_final_child_data
        return final_system_rel   

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
            taskData.append({"task_name": text, "task_data": tData, "ship_name": ship_name})

        mission = MissionProfile()
        data_m = mission.select_mission(toJson=False)
        ship_names = list(task_ship_names.keys())
        f_ship_name = []
        for sN in ship_names:
            f_ship_name.append({"name": sN})

        main_data = {
            "tasks": task_names,
            "missionData": data_m,
            "tasks_data": taskData,
            "task_ship_name": task_ship_names,
            'ship_name': f_ship_name
        }
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
        cursor.execute(query.GET_COMPONENT_ID, ship_name, eq_name)
        id_ = cursor.fetchone()[0]
        data["equipementId"] = id_
        return data

   