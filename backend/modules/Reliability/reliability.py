from backend.dB.dB_connection import cnxn, cursor
import numpy as np
from itertools import groupby
from operator import itemgetter
import pandas as pd
from backend.modules.Reliability.alpha_beta import AlphaBeta
from backend.dB.Reliability import query as q


class Reliability:

    def __init__(self):
        self.success_return = {
            "message": "Data Saved Successfully.",
            "code": 1,
        }
        self.error_return = {
            "message": "Some Error Occured, Please try agian.",
            "code": 0,
        }
        self.__ship_name = None
        self.__component_name = None
        self.__component_id = None
        self.__rel_F = None

    def get_curr_age(self):

        cursor.execute(q.GET_LATEST_RUNNING_AGE, (self.__component_id,))
        row = cursor.fetchone()
        if row is None:
            return None
        maintenance_type, running_age = row
        if maintenance_type == "Overhaul":
            return 0.0
        if running_age is None:
            return None
        
        return float(running_age)

    def calculate_rel_by_power_law(self, alpha, beta, duration):
        cursor.execute(
            q.GET_COMPONENT_ID,
            (self.__ship_name, self.__component_name),
        )
        result = cursor.fetchone()

        if not result:
            return None

        self.__component_id = result[0]
        curr_age = self.get_curr_age()

        if curr_age is None:
            curr_age = 0

        N_currentAge = alpha * (curr_age ** beta)
        missionAge = curr_age + duration
        N_mission = alpha * (missionAge ** beta)
        N = N_mission - N_currentAge
        rel = np.e ** (-N)
        return rel

    def lmu_rel(self, mission_name, system, platform, total_dur):
        sys_lmus = []
        cursor.execute(q.GET_ALPHA_BETA_JOIN, (system, platform))
        alpha_beta_data = cursor.fetchall()
        eta_beta_data = []

        if len(alpha_beta_data) == 0:
            cursor.execute(q.GET_ETA_BETA_JOIN, (system, platform))
            eta_beta_data = cursor.fetchall()
        cursor.execute(q.GET_SYSTEM_CONFIGURATION, (platform, system))
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
                    total_dur,
                )
                lmus_rel.append({
                    "name": lmu[5],
                    "id": lmu[4],
                    "rel": rel,
                    "parent_name": lmu[9],
                    "parent_id": lmu[6],
                })

        else:
            for lmu in eta_beta_data:
                eta = lmu[1]
                beta = lmu[2]
                c_age = 0
                rel_num = np.exp(-((c_age + float(total_dur)) / eta) ** beta)
                rel_deno = np.exp(-(c_age / eta) ** beta)
                rel = float(rel_num) / float(rel_deno)
                lmus_rel.append({
                    "name": lmu[6],
                    "id": lmu[5],
                    "rel": rel,
                    "parent_name": lmu[10],
                    "parent_id": lmu[7],
                })
        sys_lmus.append({system + "_" + platform: lmus_rel})
        return sys_lmus, sys_data

    def system_rel(self, mission_name, system, platform, total_dur):
        sys_lmus, sys_data = self.lmu_rel(mission_name,system,platform,total_dur)
        final_data = [] + sys_lmus[0][system + "_" + platform]
        if not final_data:
            return {"rel": 0, "child": []}
        self.__rel_F = final_data[0]["rel"]

        def inside_func(lmus, system, platform, is_lmu=False):
            current_batch = []
            if is_lmu:
                lmus = list(
                    filter(lambda x: x[system + "_" + platform], lmus)
                )[0][system + "_" + platform]

            parent_grps = groupby(lmus, key=itemgetter("parent_id"))
            parent_grps = set(map(lambda b: b[0], parent_grps))

            for key in parent_grps:
                grp = list(
                    filter(lambda rel: rel["parent_id"] == key, lmus)
                )
                rel = 1
                for r in grp:
                    rel *= r["rel"]
                if key is not None:
                    parent = list(
                        filter(lambda x: x[0] == key, sys_data)
                    )[0]
                    current_batch.append({
                        "name": parent[1],
                        "id": key,
                        "parent_name": parent[5],
                        "parent_id": parent[2],
                        "rel": rel,
                    })
            return current_batch
        current_b = inside_func(sys_lmus, system, platform, True)
        
        while len(current_b) > 0:
            current_b = inside_func(current_b, system, platform)
            final_data += current_b
        df = pd.DataFrame(final_data)

        final_system_rel = {"rel": 1, "child": []}
        final_grps = df.groupby(by="id")

        for index, gs in final_grps:
            rel = np.prod(gs["rel"].values)
            name = gs.iloc[0]["name"]
            parent_name = gs.iloc[0]["parent_name"]

            if name == system:
                final_system_rel["rel"] = rel

            if parent_name == system:
                final_system_rel["child"].append({
                    "name": name,
                    "id": index,
                    "rel": rel,
                    "parent_name": parent_name,
                    "parent_id": gs.iloc[0]["parent_id"],
                })
        return final_system_rel

    def mission_wise_rel_systemEQ(self,missions,eqData,nomenclatures,temp_missions,):
        try:
            final_data = []
            m = "Temp Mission"
            target_rel = 0.9
            ab = AlphaBeta()

            for tm in missions:
                data = {}
                for sys in eqData:
                    component = sys["equipmentName"]
                    platform = sys["parent"]
                    instances = [
                        item
                        for item in nomenclatures
                        if item["equipmentName"] == component
                        and item["parent"] == platform
                    ]

                    for e in instances:
                        system = e["nomenclature"]
                        self.__ship_name = platform
                        self.__component_name = system                    
                        cursor.execute(
                            q.GET_COMPONENT_ID,
                            (platform, system),
                        )
                        result = cursor.fetchone()

                        if not result:
                            continue
                        self.__component_id = result[0]
                        ab.set_component(self.__component_name,self.__component_id,)
                        ab.estimate_alpha_beta(component_id=self.__component_id)
                        single_rel_duration = int(tm)
                        rel = self.system_rel(m,system,platform,single_rel_duration)

                        if rel["rel"] == 1:
                            rel["rel"] = self.__rel_F
                        estimation_ach = 1
                        if rel["rel"] > target_rel:
                            estimation_ach = 1
                        rel["prob_ac"] = estimation_ach
                        if platform not in data:
                            data[platform] = []
                        rel["equipment"] = component
                        if system not in [
                            list(d.keys())[0]
                            for d in data.get(platform, [])
                        ]:
                            data[platform].append({system: rel})
                final_data.append({m: data})
            self.success_return["message"] = "Reliability displayed successfully"
            self.success_return["results"] = final_data
            return self.success_return
        
        except Exception as e:
            self.error_return["message"] = str(e)
            return self.error_return
