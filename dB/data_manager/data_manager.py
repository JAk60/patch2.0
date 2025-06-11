import pyodbc
import logging
from os import execlp
from depricated_stuff.MLE import Mle
from dB.dB_connection import cursor, cnxn
from dB.data_manager.data_manager_dB import DataManagerDB
from classes.overhaulsAlgos import OverhaulsAlgos
import numpy as np
from statistics import mean
from scipy.optimize import fsolve
import math
from scipy import integrate
from scipy.stats import weibull_min
from uuid import uuid4
from calendar import monthrange
from dB.dB_utility import get_parentId
from datetime import datetime, timedelta
from calendar import monthrange
import uuid
from scipy.optimize import minimize
from flask import jsonify


class Data_Manager:
    def __init__(self):
        DataManagerDB()  # Assuming this initializes DB connection
        self.success_return = {
            "message": "Data Saved Successfully.", "code": 1}
        self.error_return = {
            "message": "Some Error Occurred, Please try again.",
            "code": 0,
        }
        self.overhaul_id = ""

    @staticmethod
    def save_eta_beta(eta: float, beta: float, component_id: str, priority: int) -> dict:
        """
        Inserts or updates eta/beta based on unique (component_id, priority) combination.

        Args:
            conn: Active pyodbc connection.
            eta: Estimated Time of Arrival.
            beta: Beta value.
            component_id: ID of the component.
            priority: Priority level (1–7).

        Returns:
            dict: Success or error response.
        """
        row_id = str(uuid.uuid4())

        sql = """
        MERGE dbo.eta_beta AS target
        USING (VALUES (?, ?, ?, ?, ?)) AS source (id, eta, beta, component_id, priority)
            ON target.component_id = source.component_id AND target.priority = source.priority
        WHEN MATCHED THEN
            UPDATE SET eta = source.eta, beta = source.beta
        WHEN NOT MATCHED THEN
            INSERT (id, eta, beta, component_id, priority)
            VALUES (source.id, source.eta, source.beta, source.component_id, source.priority);
        """

        try:
            cursor.execute(sql, row_id, eta, beta, component_id, priority)
            cursor.commit()
            # cursor.close()
            return {
                "message": "ETA/BETA saved successfully.",
                "code": 1,
                "component_id": component_id,
                "priority": priority
            }
        except pyodbc.Error as db_err:
            logging.error(f"Database error while saving ETA/BETA: {db_err}")
            cursor.rollback()
            return {
                "message": f"Database error: {str(db_err)}",
                "code": 0
            }
        except Exception as e:
            logging.exception(f"Unexpected error in save_eta_beta: {e}")
            cursor.rollback()
            return {
                "message": f"Unexpected error: {str(e)}",
                "code": 0
            }

    def update_parameters(self, data):
        systemType_replaceable = data["isReplacable"]
        data = data["data"]
        component_id = None
        final_data = []
        try:
            for d in data:
                id = d["id"]
                component_id = id
                name = d["EquipmentName"]
                if systemType_replaceable:
                    self.update_through_MLE(id)
                    sql = """select * from eta_beta where component_id = ?"""
                    cursor.execute(sql, (id,))
                    rows = cursor.fetchone()
                    if rows:
                        final_data.append(
                            {
                                "EquipmentName": name,
                                "id": id,
                                "eta": round(rows[1], 2),
                                "beta": rows[2],
                            }
                        )
                else:
                    instance = OverhaulsAlgos()
                    sub_query = "select * from data_manager_overhauls_info where component_id = ?"
                    cursor.execute(sub_query, (id,))
                    data = cursor.fetchall()
                    subData = []
                    for item in data:
                        formatted_item = {
                            "id": item[0],
                            "overhaulNum": item[2],
                            "numMaint": item[4],
                            "runAge": item[3],
                            "component_id": item[1],
                        }
                        subData.append(formatted_item)
                    run_age_value = list(
                        map(lambda item: item["runAge"], subData))[0]
                    instance.insert_overhauls_data(
                        equipment_id=component_id,
                        run_age_component=float(run_age_value),
                    )

                    main_query = """SELECT * FROM data_manager_overhaul_maint_data 
                                WHERE component_id = ?
                        """
                    cursor.execute(main_query, (id,))
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

                    instance.alpha_beta_calculation(mainData, subData, id)

                    sql = """select * from alpha_beta where component_id = ?"""
                    cursor.execute(sql, (id,))
                    rows = cursor.fetchall()
                    rows = rows[-1]
                    if rows:
                        final_data.append(
                            {
                                "EquipmentName": name,
                                "id": id,
                                "alpha": rows[1],
                                "beta": rows[2],
                            }
                        )
                    else:
                        final_data.append(
                            {"EquipmentName": name, "id": id,
                                "alpha": "-", "beta": "-"}
                        )
                    return final_data
        except Exception as e:
            print(e)
            sql = """select * from alpha_beta where component_id = ?"""
            cursor.execute(sql, (id,))
            rows = cursor.fetchall()
            rows = rows[-1]
            if rows:
                final_data.append(
                    {"EquipmentName": name, "id": id,
                        "alpha": rows[1], "beta": rows[2]}
                )
            else:
                final_data.append(
                    {"EquipmentName": name, "id": id, "alpha": "-", "beta": "-"}
                )
            return final_data

    def insert_data(self, data_obj):
        print(data_obj, "data_obj")
        print(data_obj, "data_obj")
        data = data_obj["data"]
        dt = data_obj["dataType"]
        res = {}
        if dt == "oem":
            self.oem_save(data)
        if dt == "fdp":
            self.save_actual_data(data)
        if dt == "interval":
            self.save_interval_data(data)
        if dt == "oemE":
            self.oem_expert_save(data)
        if dt == "expert":
            self.expert_save(data)
        if dt == "prob":
            self.prob_save(data)
        if dt == "nprd":
            self.nprd_save(data)
        if dt == "import_replacable":
            self.import_replacable_save(data)
        if dt == "insertOpData":
            res = self.insert_opdata(data)
        if dt == "maintData":
            res = self.insert_maintenance_data(data)
        if dt == "overhauls":
            res = self.insert_overhauls(data)
        if dt == "overhaul_age":
            res = self.insert_overhaul_age(data)
        cnxn.commit()
        return res

    def oem_save(self, data):
        insert_sql = """insert into data_manager_oem (id, life_estimate1_name, 
        life_estimate1_val, life_estimate2_name, life_estimate2_val,
        component_id) values (?,?,?,?,?,?)"""
        for d in data:
            id = d["id"]
            component_id = d["component_id"]
            life_estimate1 = d["life_estimate1"]
            life_estimate2 = d["life_estimate2"]
            life_estimate1_val = d["life_estimate1_val"]
            life_estimate2_val = d["life_estimate2_val"]
            try:
                cursor.execute(
                    insert_sql,
                    id,
                    life_estimate1,
                    life_estimate1_val,
                    life_estimate2,
                    life_estimate2_val,
                    component_id,
                )
                n, b = self.solve_for_eta_beta_oem(
                    life_estimate1_val,
                    life_estimate2_val,
                    life_estimate1,
                    life_estimate2,
                )
                self.save_eta_beta(n, b, component_id, 3)
                self.check_TTF_num_priority_wise(n, b, component_id, 3)
            except Exception as e:
                pass

    def oem_expert_save(self, data):
        insert_Sql = """insert into data_manager_oem_expert (id, most_likely_life, max_life, min_life, 
        life_estimate_name, life_estimate_val,
        component_id, num_component_wo_failure, time_wo_failure) values (?,?,?,?,?,?,?,?,?)"""
        for d in data:
            id = d["id"]
            component_id = d["component_id"]
            max_life = float(d["maxLife"])
            min_life = float(d["minLife"])
            life_estimate_name = d["life_estimate1"]
            life_esti_val = float(d["life_estimate1_val"])
            most_likely = float(d["mostLikely"])
            # no_replacement = float(d['noReplacements'])
            componentFailure = float(d["componentFailure"])
            time_wo_failure = float(d["time_wo_failure"])
            try:
                n, b = self.solve_for_eta_beta_oem_expert(
                    life_esti_val,
                    life_estimate_name,
                    min_life,
                    max_life,
                    most_likely,
                    componentFailure,
                    time_wo_failure,
                )
                cursor.execute(
                    insert_Sql,
                    id,
                    most_likely,
                    max_life,
                    min_life,
                    life_estimate_name,
                    life_esti_val,
                    component_id,
                    componentFailure,
                    time_wo_failure,
                )
                self.save_eta_beta(n, b, component_id, 4)
                self.check_TTF_num_priority_wise(n, b, component_id, 4)
            except Exception as e:
                pass

    def expert_save(self, data):
        insert_sql = """insert into data_manager_expert (id, most_likely_life, max_life, min_life,
         component_id, num_component_wo_failure, time_wo_failure) values (?,?,?,?,?,?,?)"""
        for d in data:
            id = d["id"]
            component_id = d["component_id"]
            max_life = float(d["maxLife"])
            min_life = float(d["minLife"])
            most_likely = float(d["mostLikely"])
            # no_replacement = float(d['noReplacements'])
            componentFailure = float(d["componentFailure"])
            time_wo_failure = float(d["time_wo_failure"])
            try:
                n, b = self.solve_for_eta_beta_oem_expert(
                    None,
                    None,
                    min_life,
                    max_life,
                    most_likely,
                    componentFailure,
                    time_wo_failure,
                )
                cursor.execute(
                    insert_sql,
                    id,
                    most_likely,
                    max_life,
                    min_life,
                    component_id,
                    componentFailure,
                    time_wo_failure,
                )
                self.save_eta_beta(n, b, component_id, 5)
                self.check_TTF_num_priority_wise(n, b, component_id, 5)
            except Exception as e:
                pass

    def prob_save(self, data):
        insert_sql = """insert into data_manager_prob_failure (id, p_time, failure_p,
         component_id) values (?,?,?,?)"""
        for d in data:
            id = d["id"]
            component_id = d["component_id"]
            f_prob = d["failureProb"]
            time_ = d["time"]
            try:
                n, b = self.solve_failure_prob([d])
                print(n, b)
                cursor.execute(insert_sql, id, time_, f_prob, component_id)
                self.save_eta_beta(n, b, component_id, 6)
                self.check_TTF_num_priority_wise(n, b, component_id, 6)
            except Exception as e:
                pass

    def nprd_save(self, data):
        insert_sql = """insert into data_manager_nprd (id, failure_rate, 
        beta, component_id) values (?,?,?,?)"""
        for d in data:
            id = d["id"]
            component_id = d["component_id"]
            f_rate = d["failureRate"]
            beta = d["beta"]
            try:
                n, b = self.solve_eta_beta_nprd(d)
                cursor.execute(insert_sql, id, f_rate, beta, component_id)
                self.save_eta_beta(n, b, component_id, 7)
                self.check_TTF_num_priority_wise(n, b, component_id, 7)
            except Exception as e:
                pass

    def import_replacable_save(self, data):
        insert_sql = """insert into eta_beta 
        (id, eta, beta, component_id, priority) values (?,?,?,?,?)"""
        for d in data:
            id = d["id"]
            component_id = d["component_id"]
            eta = d["eta"]
            beta = d["beta"]
            try:
                is_exist = self.check_component_exists(
                    component_id, "eta_beta")
                if is_exist:
                    update_sql = (
                        """update eta_beta set eta=?, beta=? where component_id=?"""
                    )
                    cursor.execute(update_sql, eta, beta, component_id)
                else:
                    cursor.execute(insert_sql, id, eta, beta, component_id, 1)
            except Exception as e:
                pass

    def import_repairable_save(self, data):
        insert_sql = """insert into data_manager_repairable_import
         (id, alpha, beta, component_id) values (?,?,?,?);"""
        for d in data:
            id = d["id"]
            component_id = d["component_id"]
            alpha = d["alpha"]
            beta = d["beta"]

            try:
                cursor.execute(insert_sql, id, alpha, beta, component_id)
            except Exception as e:
                pass

    def save_actual_data(self, data):
        insert_sql = """insert into data_manager_actual_data (id, interval_start_date, 
        component_id, f_s, interval_end_date)
        values (?,?,?,?,?);"""
        try:
            for d in data:
                print(f"d value {d}")
                id = d["id"]
                f_s = d["actual_failure"]
                install_s_date = d["installationDate"]
                install_end_date = d["removalDate"]
                component_id = d["component_id"]
                # TTF Data
                date_i_now = datetime.strptime(str(install_s_date), "%d/%m/%Y")
                date_r_now = datetime.strptime(
                    str(install_end_date), "%d/%m/%Y")

                parent_system_id = get_parentId(component_id)
                average_running_hours_sql = """select num_cycle_or_runtime from system_config_additional_info where component_id = ?"""
                cursor.execute(average_running_hours_sql, parent_system_id)
                average_running_data = cursor.fetchone()[0]

                # num_months = (date_r_now.year - date_i_now.year) * \
                #     12 + (date_r_now.month - date_i_now.month)
                num_days = (date_r_now - date_i_now).days

                dateDiff = (num_days * average_running_data) / 30.437
                if dateDiff > 0:
                    self.save_TTF([dateDiff], component_id, 1, f_s)
                cursor.execute(
                    insert_sql, id, date_i_now, component_id, f_s, date_r_now
                )
            self.success_return
        except Exception as e:
            self.error_return["message"] = str(e)
            return self.error_return

    def save_interval_data(self, data):
        insert_interval_sql = """insert into data_manager_interval_data (id, 
        installation_start_date, installation_end_date, component_id, f_s,
        removal_start_date, removal_end_date) values (?,?,?,?,?,?,?)"""
        try:
            for d in data:
                id = d["id"]
                component_id = d["component_id"]
                install_start_date = d["installationStartDate"]
                install_end_date = d["installationEndDate"]
                remove_start_date = d["removalStartDate"]
                remove_end_date = d["removalEndDate"]
                f_s = d["interval_failure"]
                print(id, component_id, install_start_date,
                      install_end_date, f_s)
                # TTF logic
                i_startDate = datetime.strptime(
                    str(install_start_date), "%d/%m/%Y")
                i_endDate = datetime.strptime(
                    str(install_end_date), "%d/%m/%Y")
                meanDate_install_date = i_startDate + timedelta(
                    (i_endDate - i_startDate).days / 2
                )

                r_startDate = str(datetime.strptime(
                    str(remove_start_date), "%d/%m/%Y"))
                r_endDate = str(datetime.strptime(
                    str(remove_end_date), "%d/%m/%Y"))
                meanDate_end_date = r_startDate + timedelta(
                    (r_endDate - r_startDate).days / 2
                )

                parent_system_id = get_parentId(component_id)
                average_running_hours_sql = """select num_cycle_or_runtime from system_config_additional_info where component_id = ?"""
                cursor.execute(average_running_hours_sql, parent_system_id)
                average_running_data = cursor.fetchone()[0]

                # num_months = (meanDate_end_date.year - meanDate_install_date.year) * \
                #     12 + (meanDate_end_date.month - meanDate_end_date.month)
                num_days = (meanDate_end_date - meanDate_install_date).days

                dateDiff = (num_days * average_running_data) / 30.437
                # dateDiff = num_months*average_running_data
                if dateDiff > 0:
                    self.save_TTF([dateDiff], component_id, 1, f_s)

                cursor.execute(
                    insert_interval_sql,
                    id,
                    install_start_date,
                    install_end_date,
                    component_id,
                    f_s,
                    remove_start_date,
                    remove_end_date,
                )
            self.success_return
        except Exception as e:
            self.error_return["message"] = str(e)
            return self.error_return

    def solve_for_eta_beta_oem(self, l1, l2, l1esti, l2esti):
        l11 = (100 - float(l1esti[1:])) / 100
        l22 = (100 - float(l2esti[1:])) / 100

        def equations(p):
            n, b = p
            return (
                -((float(l1) / n) ** b) - np.log(l11),
                -((float(l2) / n) ** b) - np.log(l22),
            )

        n, b = fsolve(equations, (1, 1))
        return n, b

    def solve_for_eta_beta_oem_expert(
        self,
        l1,
        l1esti,
        minLife,
        maxLife,
        mostLikely,
        num_comp_failure,
        time_wo_failure,
    ):
        if l1esti:
            l11 = float(l1esti[1:]) / 100
        list_ = [l1, minLife, maxLife, mostLikely, num_comp_failure]
        list_ = [i for i, x in enumerate(list_) if x]
        list_ = list_[0:2]

        def zero_failure_equation(n, b):
            # n = number of component seen withour failure
            num = num_comp_failure
            cl = 0.9
            time_ = time_wo_failure  # time seen without failure
            P = (1 - cl) ** (1 / num)
            R = 0
            for i in range(0, 2):
                numerator = math.factorial(num) * (P**i)((1 - P) ** (num - i))
                deno = math.factorial(0) * math.factorial(num - i)
                R = R + (numerator / deno)
            eq = R - np.e ** (-((time_ / n) ** b))
            return eq

        def equations(p):
            n = p[0]
            b = p[1]
            z = np.empty(2)
            n, b = p
            e2 = ""
            e1 = ""
            if list_[0] == 0:
                z[0] = -((float(l1) / n) ** b) - np.log(l11)
            elif list_[0] == 1:
                # minLife equation
                z[0] = 0.99 - np.e ** (-((float(minLife) / n) ** b))
                pass
            elif list_[0] == 2:
                # maxLife equation
                z[0] = 0.01 - np.e ** (-((float(maxLife) / n) ** b))
                pass
            elif list_[0] == 3:
                # mostLikely
                z[0] = n * (((b - 1) / b) ** (1 / b)) - float(mostLikely)
                pass
            elif list_[0] == 4:
                if time_wo_failure:
                    z[0] = zero_failure_equation(n, b)
            # Equation 2
            if list_[1] == 1:
                # minLife equation
                z[1] = 0.99 - np.e ** (-((float(minLife) / n) ** b))
                pass
            elif list_[1] == 2:
                # maxLife equation
                z[1] = 0.01 - np.e ** (-((float(maxLife) / n) ** b))
                pass
            elif list_[1] == 3:
                # mostLikely
                z[1] = n * (((b - 1) / b) ** (1 / b)) - float(mostLikely)
                pass
            elif list_[0] == 4:
                if time_wo_failure:
                    z[1] = zero_failure_equation(n, b)

            return z

        zGuess = np.array([1, 1])
        n, b = fsolve(equations, zGuess)
        print("n value", n, "b value", b)
        return n, b

    def solve_failure_prob(self, data):
        xsData = []
        ysData = []
        for x in data:
            xsData.append(np.log(float(x["time"])))
            ysData.append(np.log(-np.log(1 - float(x["failureProb"]) / 100)))
        xs = np.array(xsData, dtype=np.float64)
        ys = np.array(ysData, dtype=np.float64)
        b = ((mean(xs) * mean(ys)) - mean(xs * ys)) / (
            (mean(xs) * mean(xs)) - mean(xs * xs)
        )
        c = ysData[0] - b * xsData[0]
        n = (2.718281828459045) ** (-c / b)
        return n, b

    def solve_eta_beta_nprd(self, x):
        gamma_param = (1 / float(x["beta"])) + 1

        def integrate_func(x22):
            return np.exp(-x22) * (x22 ** (gamma_param - 1))

        integrate_res = integrate.quad(integrate_func, 0, np.inf)
        eeta = 1 / (float(x["failureRate"]) * integrate_res[0])
        print(eeta, x["beta"])
        return eeta, x["beta"]

    def generate_TTF_points(self, eta, beta, num):
        dps = weibull_min.rvs(beta, loc=0, scale=eta, size=num)
        return dps

    def check_component_exists(self, component_id, dataTable):
        check_sql = """select component_id from {} where component_id = ?""".format(
            dataTable
        )
        cursor.execute(check_sql, component_id)
        exist = cursor.fetchone()
        if exist:
            return True
        else:
            False

    def check_TTF_num_priority_wise(self, n, b, component_id, priority, f_s="Failure"):
        select_sql = """select * from TTF_data where priority < ?"""
        cursor.execute(select_sql, priority)
        rows = cursor.fetchall()
        num_to_generate_dps = 15 - len(rows)
        if num_to_generate_dps > 0:
            dps = self.generate_TTF_points(n, b, num_to_generate_dps)
            self.save_TTF(dps, component_id, priority, f_s)

    def save_TTF(self, data, component_id, priority, f_s):
        insert_sql = """insert into TTF_data (id, hours, component_id, f_s, priority)
                            values (?,?,?,?,?);"""
        try:
            for dp in data:
                id = uuid4()
                cursor.execute(insert_sql, id, dp, component_id, f_s, priority)
            return True
        except:
            return False

    def update_through_MLE(self, component_id):
        """This function takes component id and checks if dps > 15 then if updated in 12 hours
        then return false and not update eta beta else update eta_beta"""
        select_sql = """select * from TTF_data where component_id=? and priority = 1"""
        cursor.execute(select_sql, component_id)
        rows = cursor.fetchall()
        dps = []
        if len(rows) >= 15:
            for r in rows:
                dps.append(r[1])
        else:
            count = 15 - len(rows)
            select_extra_rows = """select TOP(?) * from TTF_data where component_id=?
             and priority > 1"""
            cursor.execute(select_extra_rows, count, component_id)
            row_extra = cursor.fetchall()
            rows = rows + row_extra
            for r in rows:
                dps.append(r[1])
        if len(dps) >= 15:
            mle_inst = Mle()
            n, b = mle_inst.twoParamWeibullEstimationForNRSEqForming(
                dps, len(dps))
            print(f"MLE nvalue {n}  b value {b}")

            update_sql = """update eta_beta set eta=?, beta=? where component_id=?"""
            update_sql(update_sql, n, b, component_id)
            cnxn.commit()

    def insert_opdata(self, data):
        try:
            for d in data:
                id = d["oid"]
                component_id = d["id"]
                operation_date = str(d["Date"])
                print(operation_date)
                date_ = datetime.strptime(str(operation_date), "%B/%Y")

                average_running = d["AverageRunning"]
                merge_opdata = """
                    MERGE INTO operational_data AS target
                    USING (VALUES (?, ?, ?, ?)) AS source (id,component_id, operation_date, average_running)
                    ON target.component_id = source.component_id AND target.operation_date = source.operation_date
                    WHEN MATCHED THEN
                        UPDATE SET average_running = ?
                    WHEN NOT MATCHED THEN
                        INSERT (id,component_id, operation_date, average_running)
                        VALUES (?, ?, ?, ?);
                """

                cursor.execute(merge_opdata, (id, component_id, date_, average_running,
                               average_running, id, component_id, date_, average_running))
            cnxn.commit()
            return self.success_return
        except Exception as e:
            self.error_return["message"] = str(e)
            return self.error_return

    def insert_maintenance_data(self, data):
        insert_sql = """insert into data_manager_maintenance_data (id, component_id, event_type, maint_date, maintenance_type,
                                           replaced_component_type, cannabalised_age, maintenance_duration,
                                           failure_mode, description)
                                values (?,?,?,?,?,?,?,?,?,?)"""
        try:
            for d in data:
                id = d["id"]
                component_id = d["component_id"]
                event_type = d["EventType"]
                date_ = str(d["Date"])
                date_ = datetime.strptime(str(date_), "%d/%m/%Y")
                mType = d["MaintainanceType"]
                replaceType = d["ReplaceType"]
                cannAge = d["CannibalisedAge"]
                MaintenanceDuration = float(d["MaintenanceDuration"])
                fm = d["FM"]
                desc = d["Remark"]
                self.maintenance_save_logic(d)
                cursor.execute(
                    insert_sql,
                    id,
                    component_id,
                    event_type,
                    date_,
                    mType,
                    replaceType,
                    cannAge,
                    MaintenanceDuration,
                    fm,
                    desc,
                )

            cnxn.commit()
            return self.success_return
        except Exception as e:
            self.error_return["message"] = str(e)
            return self.error_return

    def maintenance_save_logic(self, d):
        latest_failure_date = """select Top (1) maint_date from data_manager_maintenance_data where component_id = ? order by maint_date desc"""
        installation_date_sql = """select installation_date from system_config_additional_info where component_id =?"""
        parent_system_id = """select component_id from system_configuration where system_configuration.component_name in
                (select component_name from system_configuration where component_id = ?)
                    and system_configuration.ship_name in
                        (select ship_name from system_configuration where component_id = ?)
                and system_configuration.component_name in ((select component_name from system_configuration where component_id = ?))"""

        opr_date = """select SUM(average_running) from operational_data where component_id = ?
         and (operation_date between ? and ?)"""

        component_id = d["component_id"]
        date_ = str(d["Date"])
        date_ = datetime.strptime(str(date_), "%d/%m/%Y")

        cursor.execute(parent_system_id, component_id,
                       component_id, component_id)
        parent_id = cursor.fetchone()
        parent_id = parent_id[0]
        TTF = 0
        cursor.execute(latest_failure_date, component_id)
        latest_date = cursor.fetchone()
        if len(latest_date) > 0:
            latest_date = latest_date[0]
            cursor.execute(opr_date, parent_id, latest_date, date_)
            TTF = cursor.fetchone()
            if len(TTF) > 0:
                TTF = TTF[0]
        else:
            cursor.execute(installation_date_sql, parent_id)
            installation_date = cursor.fetchone()
            if len(installation_date) > 0:
                installation_date = installation_date[0]
                cursor.execute(opr_date, parent_id, installation_date, date_)
                TTF = cursor.fetchone()
                if len(TTF) > 0:
                    TTF = TTF[0]

        if TTF:
            TTF = float(TTF)
            self.save_TTF([TTF], component_id, 1, "Failure")
            return True

        return False

    def extract_failure_times(self, input_data):
        failure_times = []
        overhaul_data = {}
        present_overhaul_data = []

        for data in input_data:
            if data is None:
                continue
            overhaul_id = data.get("overhaulId")
            if overhaul_id:
                total_run_age = float(data.get("runningAge", 0))
                if overhaul_id in overhaul_data:
                    overhaul_data[overhaul_id].append(total_run_age)
                else:
                    overhaul_data[overhaul_id] = [total_run_age]
            else:
                total_run_age = float(data.get("runningAge", 0))
                present_overhaul_data.append(total_run_age)
                # failure_times.append([total_run_age])

        for overhaul_id, data in overhaul_data.items():
            failure_times.append(data)
        failure_times.append(present_overhaul_data)
        return failure_times

    def extract_run_age(self, main_data, sub_data):
        run_ages = [float(entry["runAge"]) for entry in sub_data]

        last_run_age = None
        for data in reversed(main_data):
            if data is None:
                continue
            if "overhaulId" not in data:
                last_run_age = float(data.get("runningAge", 0))
                break

        if last_run_age is not None:
            run_ages.append(last_run_age)

        return run_ages

    def insert_overhauls(self, data):
        mainData = data[0]["mainData"]
        subData = data[0]["subData"]
        component_id = ""
        insert_sub_sql = """insert into data_manager_overhauls_info (id, 
        component_id, overhaul_num, running_age, num_maintenance_event)
        values (?,?,?,?,?);"""
        insert_main_sql = """MERGE INTO data_manager_overhaul_maint_data AS target
                    USING (VALUES (?, ?, ?, ?, ?, ?, ?)) AS source (id, component_id, overhaul_id, date, maintenance_type, associated_sub_system, cmms_running_age)
                    ON target.component_id = source.component_id
                    AND target.date = source.date
                    WHEN NOT MATCHED THEN
                    INSERT (id, component_id, overhaul_id, date, maintenance_type, associated_sub_system, cmms_running_age)
                    VALUES (?, ?, ?, ?, ?, ? , ?);"""
        last_age_entry_sql = (
            """select max(cmms_running_age) from data_manager_overhaul_maint_data"""
        )
        cursor.execute(last_age_entry_sql)
        last_cmms_age = cursor.fetchone()[0]
        index = 0
        run_age_component = 0
        try:
            for d in subData:
                if d:
                    index += 1
                    id = d["id"]
                    overhaulNum = d["overhaulNum"]
                    runAge = d["runAge"]
                    if index == 1:
                        run_age_component = runAge
                    numMaint = d["numMaint"]
                    component_id = d["component_id"]
                    cursor.execute(
                        insert_sub_sql, id, component_id, overhaulNum, runAge, numMaint
                    )
        except Exception as e:
            self.error_return["message"] = str(e)
            return self.error_return

        # last_age_entry_sql = '''SELECT COALESCE(MAX(cmms_running_age), 0) FROM data_manager_overhaul_maint_data WHERE component_id = ?'''
        # cursor.execute(last_age_entry_sql, component_id)
        # last_cmms_age = float(cursor.fetchone()[0])
        # run_ages_array = []

        # for d in mainData:
        #     if d:
        #         run_ages_array.append(float(d["totalRunAge"]))

        # small_values = all(value < last_cmms_age for value in run_ages_array)
        # if small_values:
        #     self.error_return["message"] = f"The current running age corresponding to defect should be greater then previous value. \n Previous value is {last_cmms_age}"
        #     return self.error_return
        # is_sorted = all(run_ages_array[i] <= run_ages_array[i + 1] for i in range(len(run_ages_array) - 1))
        # if is_sorted == False:
        #     self.error_return["message"] = f"The current running age corresponding to defect should be greater then previous value. \n Previous value is {last_cmms_age}"
        #     return self.error_return

        try:
            for d in mainData:
                if d:
                    id = d["id"]
                    try:
                        overhaulId = d["overhaulId"]
                    except KeyError:
                        overhaulId = None
                    date = str(d["date"])
                    date = datetime.strptime(date, "%d/%m/%Y")
                    maintenanceType = d["maintenanceType"]
                    cmmsRunAge = d["totalRunAge"]
                    subSystemId = d["subSystemId"]
                    cursor.execute(
                        insert_main_sql,
                        id,
                        component_id,
                        overhaulId,
                        date,
                        maintenanceType,
                        cmmsRunAge,
                        subSystemId,
                    )
        except Exception as e:
            self.error_return["message"] = str(e)
            return self.error_return
        return self.success_return

    def fetch_eeta_beta(self, component_id):
        try:
            query = "select eta, beta from eta_beta where component_id= ?"
            cursor.execute(query, component_id)
            data = cursor.fetchone()
            return jsonify({"eta": data[0], "beta": data[1]})
        except Exception as e:
            return jsonify({"messege": "Component id is not exist"})

    def fetch_alpha_beta(self, components):
        try:
            alpha_beta_values = {}
            for component in components:
                component_id = component["id"]
                component_name = component["nomenclature"]
                query = "select alpha, beta from alpha_beta where component_id= ?"
                cursor.execute(query, component_id)
                data = cursor.fetchone()
                alpha, beta = data
                alpha_beta_values[component_name] = {
                    "id": component_id,
                    "alpha": alpha,
                    "beta": beta,
                }
            return jsonify(alpha_beta_values)
        except Exception as e:
            return jsonify({"error": str(e)})

    def update_alpha_beta(self, ship_name, component_name, alpha, beta):
        try:
            # Assuming you have a valid connection and cursor setup
            cursor = cnxn.cursor()

            # Query to fetch or insert component_id
            query = "SELECT component_id FROM system_configuration WHERE ship_name=? AND component_name=?"
            cursor.execute(query, (ship_name, component_name))
            data = cursor.fetchone()

            if data:
                component_id = data[0]
                print("component_id", component_id)
            else:
                # If component_id doesn't exist, insert a new record into system_configuration
                insert_query = "INSERT INTO system_configuration (ship_name, component_name) VALUES (?, ?)"
                cursor.execute(insert_query, (ship_name, component_name))
                cnxn.commit()

                # Fetch the newly inserted component_id
                cursor.execute(query, (ship_name, component_name))
                component_id = cursor.fetchone()[0]

            # Check if the record already exists in alpha_beta table
            cursor.execute(
                "SELECT * FROM alpha_beta WHERE component_id=?", (component_id,))
            existing_record = cursor.fetchone()

            if existing_record:
                # Update existing record
                update_query = "UPDATE alpha_beta SET alpha=?, beta=? WHERE component_id=?"
                cursor.execute(update_query, (alpha, beta, component_id))
                cnxn.commit()
                return jsonify({"message": f"Alpha beta for component {component_name} is updated"})
            else:
                # Generate a new UUID for id
                record_id = uuid.uuid4()

                # Insert new record into alpha_beta table
                insert_query = "INSERT INTO alpha_beta (id, component_id, alpha, beta) VALUES (?, ?, ?, ?)"
                cursor.execute(
                    insert_query, (record_id, component_id, alpha, beta))
                cnxn.commit()
                return jsonify({"message": f"Alpha beta for component {component_name} is inserted"})

        except Exception as e:
            return jsonify({"error": str(e)})

    def set_component_overhaul_age(self, ship_name, component_name, age):
        age = int(age)
        query = "select component_id from system_configuration where ship_name=? and component_name=?"
        cursor.execute(query, ship_name, component_name)
        data = cursor.fetchone()
        component_id = data[0]
        query = """SELECT cmms_running_age from data_manager_overhaul_maint_data where component_id=?"""
        cursor.execute(query, component_id)
        data = cursor.fetchall()[-1]
        cmms_running_age = int(data[0])
        nums = math.floor(cmms_running_age / age)
        return jsonify({"overhaul_nums": nums})

    def insert_overhaul_age(self, data):
        try:
            sub_data = data[0]["subData"]
            for d in sub_data:
                id = d["id"]
                ship_name = d["ship_name"]
                component_name = d["equipment_name"]
                nomenclature = d["nomenclature"]
                overhaul_age = d["runAge"]
                sql = '''select component_id from system_configuration where ship_name =? and component_name= ?'''
                cursor.execute(sql, ship_name, component_name)
                equipment_ids = cursor.fetchall()
                for eid in equipment_ids:
                    uid = str(uuid.uuid4())
                    equipment_id = eid[0]
                    insert_sql = '''
                        MERGE INTO data_manager_overhauls_info AS target
                        USING (SELECT ?, ?, ?, ?, ?) AS source (id, component_id, overhaul_num, running_age, num_maintenance_event)
                        ON target.component_id = source.component_id
                        WHEN MATCHED THEN
                            UPDATE SET
                                running_age = source.running_age,
                                num_maintenance_event = source.num_maintenance_event
                        WHEN NOT MATCHED THEN
                            INSERT (id, component_id, overhaul_num, running_age, num_maintenance_event)
                            VALUES (source.id, source.component_id, source.overhaul_num, source.running_age, source.num_maintenance_event);
                    '''
                    cursor.execute(insert_sql, uid, equipment_id,
                                   "1", overhaul_age, "1")
            return self.success_return
        except Exception as e:
            self.error_return["message"] = str(e)
            return self.error_return

    def get_component_overhaul_hours(self, data):
        try:
            ship_name = data["ship_name"]
            component_name = data["equipment_name"]
            nomenclature = data["nomenclature"]
            sql = '''select component_id from system_configuration where ship_name =? and component_name= ? and nomenclature=?'''
            cursor.execute(sql, ship_name, component_name, nomenclature)
            equipment_id = cursor.fetchone()[0]
            overhaul_sql = '''select running_age from data_manager_overhauls_info where component_id = ?'''
            cursor.execute(overhaul_sql, equipment_id)
            data = cursor.fetchall()[-1][0]
            self.success_return["result"] = data
            return self.success_return
        except Exception as e:
            print(e)
            return self.error_return
