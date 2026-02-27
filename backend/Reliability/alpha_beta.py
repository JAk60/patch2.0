from dB.dB_connection import cnxn, cursor
from Reliability.overhaul_algos import OverhaulsAlgos
import uuid
import math
from decimal import Decimal
from Reliability import queries as q


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
        cursor.execute(q.GET_OVERHAUL_INFO, (component_id,))
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
        cursor.execute(q.GET_OVERHAUL_MAINT_DATA, (component_id,))
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
            cursor.execute(q.GET_ALPHA_BETA, (id,))
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
            q.MERGE_ALPHA_BETA,
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

# class AlphaBeta:
#     def __init__(self):
#         self.__component_name = None
#         self.__component_id = None

#     def set_component(self, component_name, component_id):
#         self.__component_name = component_name
#         self.__component_id = component_id

#     def estimate_alpha_beta(self, component_id):
#         '''CODE TO RE-ESTIMATE ALPHA BETA'''
#         subData = []
#         try:
#             instance = OverhaulsAlgos()
#             sub_query = "select * from data_manager_overhauls_info where component_id = ?"
#             cursor.execute(sub_query, (component_id,))
#             data = cursor.fetchall()
#             if not data:
#                 raise ValueError(
#                     f"Time between two overhaul is not defined for : {self.__component_name}")
#             for item in data:
#                 formatted_item = {
#                     "id": item[0],
#                     "overhaulNum": item[2],
#                     "numMaint": item[4],
#                     "runAge": item[3],
#                     "component_id": item[1],
#                 }
#                 subData.append(formatted_item)
#             if not subData:
#                 return {"message": f"Time between two overhaul is not defined for: {self.__component_name}", "code": 0}
#             run_age_value = list(map(lambda item: item["runAge"], subData))[0]
#             success = instance.insert_overhauls_data(
#                 equipment_id=component_id,
#                 run_age_component=float(run_age_value),
#             )

#             main_query = """SELECT * FROM data_manager_overhaul_maint_data 
#                         WHERE component_id = ? ORDER BY date ASC 
#                 """
#             cursor.execute(main_query, (component_id,))
#             data = cursor.fetchall()
#             mainData = []
#             for item in data:
#                 formatted_item = {
#                     "id": item[0],
#                     "component_id": item[1],
#                     "overhaulId": item[2],
#                     "date": item[3],
#                     "maintenanceType": item[4],
#                     "totalRunAge": item[5],
#                     "subSystemId": item[6],
#                     "runningAge": item[7],
#                 }
#                 mainData.append(formatted_item)

#             self.alpha_beta_calculation(mainData, subData, component_id)
#         except Exception as e:
#             print(e)
#             if not subData or success is False:
#                 raise
#             pass

#     def equipment_failure_times(self, input_data):
#         failure_times = []
#         present_overhaul_data = []
#         for data in input_data:
#             if data is None:
#                 continue
#             else:
#                 if data["maintenanceType"] == "Overhaul":
#                     failure_times.append(present_overhaul_data)
#                     present_overhaul_data = []
#                 else:
#                     present_overhaul_data.append(float(data["totalRunAge"]))

#         if(len(present_overhaul_data) != 0):
#             failure_times.append(present_overhaul_data)
#         return failure_times

#     def extract_running_ages(self, sub_data, failure_times):
#         run_age = [float(entry["runAge"]) for entry in sub_data][0]
#         running_ages = []
#         if run_age not in failure_times:
#             running_ages.append(run_age)
#         else:
#             running_ages = [i[-1] for i in failure_times]
#         return running_ages

#     def alpha_beta_calculation(self, mainData, subData, id):
#         failure_times = self.equipment_failure_times(mainData)
#         T = self.extract_running_ages(sub_data=subData, failure_times=failure_times)
#         for sublist in failure_times:
#             if sublist == T:
#                 failure_times.pop(failure_times.index(sublist))
#         N = [len(subarray) for subarray in failure_times]
#         print(f"FALIURE TIMES from alpha_beta_calculation: {failure_times}")
#         print(f"N from alpha_beta_calculation: {N}")
#         print(f"T from alpha_beta_calculation: {T}")
#         if not failure_times:
#             query = "select alpha,beta from alpha_beta where component_id=?"
#             cursor.execute(query, id)
#             AB = cursor.fetchall()
#             print("--------------------------->>>>>>>", AB)
#             for i in AB:
#                 alpha, beta = i
#             return alpha, beta

#         def para(system_failures_list):
#             T = [Decimal(max(failures)) * Decimal('1.05') for failures in system_failures_list]
#             sum_ln_T_Xiq = [sum(Decimal(math.log(ti / Decimal(x))) for x in failures) for ti, failures in zip(T, system_failures_list)]
#             BETA = sum(Decimal(len(failures)) for failures in system_failures_list) / sum(sum_ln_T_Xiq)
#             ALPHA = sum(Decimal(len(failures)) for failures in system_failures_list) / sum(ti ** BETA for ti in T)
#             return ALPHA, BETA

#         alpha, beta = para(failure_times)
#         a_b_id = uuid.uuid4()
#         merge_query = '''
#             MERGE INTO alpha_beta AS target
#             USING (VALUES (?, ?, ?, ?)) AS source (id, component_id, alpha, beta)
#             ON target.component_id = source.component_id
#             WHEN MATCHED THEN
#                 UPDATE SET alpha = source.alpha, beta = source.beta
#             WHEN NOT MATCHED THEN
#                 INSERT (id, component_id, alpha, beta)
#                 VALUES (source.id, source.component_id, source.alpha, source.beta);
#         '''
#         cursor.execute(merge_query, (a_b_id, id, float(alpha), float(beta)))
#         cnxn.commit()
