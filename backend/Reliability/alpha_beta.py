from dB.dB_connection import cnxn, cursor
from backend.Reliability.overhaul_algos import OverhaulsAlgos
import uuid
import math
from decimal import Decimal
from backend.Reliability import query


class AlphaBeta:
    def __init__(self):
        self.__component_name = None
        self.__component_id = None

    def set_component(self, component_name, component_id):
        self.__component_name = component_name
        self.__component_id = component_id

    def estimate_alpha_beta(self, component_id):
        subData = []
        instance = OverhaulsAlgos()
        cursor.execute(query.GET_OVERHAUL_INFO, (component_id,))
        data = cursor.fetchall()
        if not data:
            raise ValueError(
                f"Time between two overhaul is not defined for : {self.__component_name}"
            )
        for item in data:
            subData.append({
                "id": item[0],
                "overhaulNum": item[2],
                "numMaint": item[4],
                "runAge": item[3],
                "component_id": item[1],
            })
        run_age_value = subData[0]["runAge"]
        instance.insert_overhauls_data(
            equipment_id=component_id,
            run_age_component=float(run_age_value),
        )
        cursor.execute(query.GET_OVERHAUL_MAINT_DATA, (component_id,))
        data = cursor.fetchall()
        mainData = [{
            "id": item[0],
            "component_id": item[1],
            "overhaulId": item[2],
            "date": item[3],
            "maintenanceType": item[4],
            "totalRunAge": item[5],
            "subSystemId": item[6],
            "runningAge": item[7],
        } for item in data]
        self.alpha_beta_calculation(mainData, subData, component_id)

    def alpha_beta_calculation(self, mainData, subData, id):
        failure_times = self.equipment_failure_times(mainData)
        T = self.extract_running_ages(subData, failure_times)
        failure_times = [ft for ft in failure_times if ft != T]
        N = [len(subarray) for subarray in failure_times]
        if not failure_times:
            cursor.execute(query.GET_ALPHA_BETA, (id,))
            AB = cursor.fetchone()
            return AB
        
        def para(system_failures_list):
            T = [Decimal(max(f)) * Decimal('1.05') for f in system_failures_list]
            sum_ln_T_Xiq = [
                sum(Decimal(math.log(ti / Decimal(x))) for x in failures)
                for ti, failures in zip(T, system_failures_list)
            ]
            BETA = sum(Decimal(len(f)) for f in system_failures_list) / sum(sum_ln_T_Xiq)
            ALPHA = sum(Decimal(len(f)) for f in system_failures_list) / sum(ti ** BETA for ti in T)
            return ALPHA, BETA
        
        alpha, beta = para(failure_times)
        a_b_id = uuid.uuid4()
        cursor.execute(
            query.MERGE_ALPHA_BETA,
            (a_b_id, id, float(alpha), float(beta))
        )
        cnxn.commit()

    def equipment_failure_times(self, input_data):
        failure_times = []
        present_overhaul_data = []
        for data in input_data:
            if data is None:
                continue
            else:
                if data["maintenanceType"] == "Overhaul":
                    failure_times.append(present_overhaul_data)
                    present_overhaul_data = []
                else:
                    present_overhaul_data.append(float(data["totalRunAge"]))
        if(len(present_overhaul_data) != 0):
            failure_times.append(present_overhaul_data)
        return failure_times

    def extract_running_ages(self, sub_data, failure_times):
        run_age = [float(entry["runAge"]) for entry in sub_data][0]
        running_ages = []
        if run_age not in failure_times:
            running_ages.append(run_age)
        else:
            running_ages = [i[-1] for i in failure_times]
        return running_ages

