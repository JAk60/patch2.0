from os import execlp
from classes.MLE import Mle
from dB.dB_connection import cursor, cnxn
from dB.data_manager.data_manager_dB import DataManagerDB
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


class Data_Manager:
    def __init__(self):
        DataManagerDB()
        self.success_return = {"message": "Data Saved Successfully.",
                               "code": 1}
        self.error_return = {"message": "Some Error Occured, Please try agian.",
                             "code": 0}

    def update_parameters(self, data):
        systemType_replaceable = data['isReplacable']
        data = data['data']
        final_data = []
        for d in data:
            id = d['id']
            print(id)
            name = d['EquipmentName']
            if systemType_replaceable:
                self.update_through_MLE(id)
                sql = '''select * from eta_beta where component_id = ?'''
                cursor.execute(sql, (id,))
                rows = cursor.fetchone()
                if rows:
                    final_data.append({
                        'EquipmentName': name,
                        'id': id,
                        'eta': round(rows[1], 2),
                        'beta': rows[2]
                    })
            else:
                sql = '''select * from alpha_beta where component_id = ?'''
                cursor.execute(sql, (id,))
                rows = cursor.fetchone()
                if rows:
                    final_data.append({
                        'EquipmentName': name,
                        'id': id,
                        'alpha': round(rows[1], 2),
                        'beta': rows[2]
                    })
                else:
                    final_data.append({
                        'EquipmentName': name,
                        'id': id,
                        'alpha': '-',
                        'beta': '-'
                    })
        return final_data


    def insert_data(self, data_obj):
        data = data_obj['data']
        dt = data_obj['dataType']
        res = {}
        if dt == "oem":
            self.oem_save(data)
        if dt == "fdp":
            self.save_actual_data(data)
        if dt == 'interval':
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
        if dt == 'insertOpData':
            res = self.insert_opdata(data)
        if dt == "maintData":
            res = self.insert_maintenance_data(data)
        if dt == "overhauls":
            self.insert_overhauls(data)
        cnxn.commit()
        return res

    def update_data(self, data):
        pass

    def oem_save(self, data):
        insert_sql = '''insert into data_manager_oem (id, life_estimate1_name, 
        life_estimate1_val, life_estimate2_name, life_estimate2_val,
        component_id) values (?,?,?,?,?,?)'''
        for d in data:
            id = d['id']
            component_id = d['component_id']
            life_estimate1 = d['life_estimate1']
            life_estimate2 = d['life_estimate2']
            life_estimate1_val = d['life_estimate1_val']
            life_estimate2_val = d['life_estimate2_val']
            try:
                cursor.execute(insert_sql, id, life_estimate1, life_estimate1_val,
                               life_estimate2, life_estimate2_val, component_id)
                n, b = self.solve_for_eta_beta_oem(
                    life_estimate1_val, life_estimate2_val, life_estimate1, life_estimate2)
                self.check_TTF_num_priority_wise(n, b, component_id, 3)
            except Exception as e:
                pass

    def oem_expert_save(self, data):
        insert_Sql = '''insert into data_manager_oem_expert (id, most_likely_life, max_life, min_life, 
        life_estimate_name, life_estimate_val,
        component_id, num_component_wo_failure, time_wo_failure) values (?,?,?,?,?,?,?,?,?)'''
        for d in data:
            id = d['id']
            component_id = d['component_id']
            max_life = float(d['maxLife'])
            min_life = float(d['minLife'])
            life_estimate_name = d['life_estimate1']
            life_esti_val = float(d['life_estimate1_val'])
            most_likely = float(d['mostLikely'])
            # no_replacement = float(d['noReplacements'])
            componentFailure = float(d['componentFailure'])
            time_wo_failure = float(d['time_wo_failure'])
            try:
                n, b = self.solve_for_eta_beta_oem_expert(life_esti_val,
                                                          life_estimate_name, min_life, max_life, most_likely, componentFailure, time_wo_failure)
                cursor.execute(insert_Sql, id, most_likely, max_life,
                               min_life, life_estimate_name, life_esti_val, component_id, componentFailure, time_wo_failure)
                self.check_TTF_num_priority_wise(n, b, component_id, 4)
            except Exception as e:
                pass

    def expert_save(self, data):
        insert_sql = '''insert into data_manager_expert (id, most_likely_life, max_life, min_life,
         component_id, num_component_wo_failure, time_wo_failure) values (?,?,?,?,?,?,?)'''
        for d in data:
            id = d['id']
            component_id = d['component_id']
            max_life = float(d['maxLife'])
            min_life = float(d['minLife'])
            most_likely = float(d['mostLikely'])
            # no_replacement = float(d['noReplacements'])
            componentFailure = float(d['componentFailure'])
            time_wo_failure = float(d['time_wo_failure'])
            try:
                n, b = self.solve_for_eta_beta_oem_expert(None,
                                                          None, min_life, max_life, most_likely, componentFailure, time_wo_failure)
                cursor.execute(insert_sql, id, most_likely, max_life,
                               min_life, component_id, componentFailure, time_wo_failure)
                self.check_TTF_num_priority_wise(n, b, component_id, 5)
            except Exception as e:
                pass

    def prob_save(self, data):
        insert_sql = '''insert into data_manager_prob_failure (id, p_time, failure_p,
         component_id) values (?,?,?,?)'''
        for d in data:
            id = d['id']
            component_id = d['component_id']
            f_prob = d['failureProb']
            time_ = d['time']
            try:
                n, b = self.solve_failure_prob([d])
                cursor.execute(insert_sql, id, time_, f_prob, component_id)
                self.check_TTF_num_priority_wise(n, b, component_id, 6)
            except Exception as e:
                pass

    def nprd_save(self, data):
        insert_sql = '''insert into data_manager_nprd (id, failure_rate, 
        beta, component_id) values (?,?,?,?)'''
        for d in data:
            id = d['id']
            component_id = d['component_id']
            f_rate = d['failureRate']
            beta = d['beta']
            try:
                n, b = self.solve_eta_beta_nprd(d)
                cursor.execute(insert_sql, id, f_rate, beta, component_id)
                self.check_TTF_num_priority_wise(n, b, component_id, 7)
            except Exception as e:
                pass

    def import_replacable_save(self, data):
        insert_sql = '''insert into eta_beta 
        (id, eta, beta, component_id, priority) values (?,?,?,?,?)'''
        for d in data:
            id = d['id']
            component_id = d['component_id']
            eta = d['eta']
            beta = d['beta']
            try:
                is_exist = self.check_component_exists(
                    component_id, 'eta_beta')
                if is_exist:
                    update_sql = '''update eta_beta set eta=?, beta=? where component_id=?'''
                    cursor.execute(update_sql, eta, beta, component_id)
                else:
                    cursor.execute(insert_sql, id, eta, beta, component_id, 1)
            except Exception as e:
                pass

    def import_repairable_save(self, data):
        insert_sql = '''insert into data_manager_repairable_import
         (id, alpha, beta, component_id) values (?,?,?,?);'''
        for d in data:
            id = d['id']
            component_id = d['component_id']
            alpha = d['alpha']
            beta = d['beta']
            try:
                cursor.execute(insert_sql, id, alpha, beta, component_id)
            except Exception as e:
                pass

    def save_actual_data(self, data):
        print("actual_data", data)
        insert_sql = '''insert into data_manager_actual_data (id, interval_start_date, 
        component_id, f_s, interval_end_date)
        values (?,?,?,?,?);'''
        try:
            for d in data:
                id = d['id']
                f_s = d['actual_failure']
                install_s_date = d['installationDate']
                install_end_date = d['removalDate']
                component_id = d['component_id']
                # TTF Data
                date_i_now = datetime.strptime(str(install_s_date), "%d/%m/%Y")
                date_r_now = datetime.strptime(
                    str(install_end_date), "%d/%m/%Y")

                parent_system_id = get_parentId(component_id)
                average_running_hours_sql = '''select num_cycle_or_runtime from system_config_additional_info where component_id = ?'''
                cursor.execute(average_running_hours_sql, parent_system_id)
                average_running_data = cursor.fetchone()[0]

                # num_months = (date_r_now.year - date_i_now.year) * \
                #     12 + (date_r_now.month - date_i_now.month)
                num_days = (date_r_now - date_i_now).days

                dateDiff = (num_days*average_running_data)/30.437
                if dateDiff > 0:
                    self.save_TTF([dateDiff], component_id, 1, f_s)
                cursor.execute(insert_sql, id, date_i_now,
                               component_id, f_s, date_r_now)
            self.success_return
        except Exception as e:
            self.error_return["message"] = str(e)
            print(e)
            return self.error_return

    def save_interval_data(self, data):
        insert_interval_sql = '''insert into data_manager_interval_data (id, 
        installation_start_date, installation_end_date, component_id, f_s,
        removal_start_date, removal_end_date) values (?,?,?,?,?,?,?)'''
        try:
            for d in data:
                id = d['id']
                component_id = d['component_id']
                install_start_date = d['installationStartDate']
                install_end_date = d["installationEndDate"]
                remove_start_date = d["removalStartDate"]
                remove_end_date = d["removalEndDate"]
                f_s = d['interval_failure']
                print(id, component_id, install_start_date, install_end_date, f_s)
                # TTF logic
                i_startDate = datetime.strptime(
                    str(install_start_date), "%d/%m/%Y")
                i_endDate = datetime.strptime(
                    str(install_end_date), "%d/%m/%Y")
                meanDate_install_date = i_startDate + \
                    timedelta((i_endDate - i_startDate).days / 2)

                r_startDate = datetime.strptime(
                    str(remove_start_date), "%d/%m/%Y")
                r_endDate = datetime.strptime(str(remove_end_date), "%d/%m/%Y")
                meanDate_end_date = r_startDate + \
                    timedelta((r_endDate - r_startDate).days / 2)

                parent_system_id = get_parentId(component_id)
                average_running_hours_sql = '''select num_cycle_or_runtime from system_config_additional_info where component_id = ?'''
                cursor.execute(average_running_hours_sql, parent_system_id)
                average_running_data = cursor.fetchone()[0]

                # num_months = (meanDate_end_date.year - meanDate_install_date.year) * \
                #     12 + (meanDate_end_date.month - meanDate_end_date.month)
                num_days = (meanDate_end_date - meanDate_install_date).days

                dateDiff = (num_days*average_running_data)/30.437
                # dateDiff = num_months*average_running_data
                if dateDiff > 0:
                    self.save_TTF([dateDiff], component_id, 1, f_s)

                cursor.execute(insert_interval_sql, id, install_start_date, install_end_date,
                               component_id, f_s, remove_start_date, remove_end_date)
            self.success_return
        except Exception as e:
            self.error_return['message'] = str(e)
            return self.error_return

    def solve_for_eta_beta_oem(self, l1, l2, l1esti, l2esti):
        l11 = (100-float(l1esti[1:]))/100
        l22 = (100-float(l2esti[1:]))/100

        def equations(p):
            n, b = p
            return (-(float(l1) / n) ** b - np.log(l11), -(float(l2) / n) ** b - np.log(l22))
        n, b = fsolve(equations, (1, 1))
        return n, b

    def solve_for_eta_beta_oem_expert(self, l1, l1esti, minLife, maxLife, mostLikely, num_comp_failure, time_wo_failure):
        if l1esti:
            l11 = float(l1esti[1:])/100
        list_ = [l1, minLife, maxLife, mostLikely, num_comp_failure]
        list_ = [i for i, x in enumerate(list_) if x]
        list_ = list_[0:2]

        def zero_failure_equation(n, b):
            # n = number of component seen withour failure
            num = num_comp_failure
            cl = 0.9
            time_ = time_wo_failure  # time seen without failure
            P = (1 - cl)**(1/num)
            R = 0
            for i in range(0, 2):
                numerator = math.factorial(num)*(P**i)((1-P)**(num-i))
                deno = math.factorial(0)*math.factorial(num-i)
                R = R + (numerator/deno)
            eq = R - np.e**(-(time_/n)**b)
            return eq

        def equations(p):
            n = p[0]
            b = p[1]
            z = np.empty(2)
            n, b = p
            e2 = ""
            e1 = ""
            if list_[0] == 0:
                z[0] = -(float(l1) / n) ** b - np.log(l11)
            elif list_[0] == 1:
                # minLife equation
                z[0] = 0.99 - np.e**(-(float(minLife)/n)**b)
                pass
            elif list_[0] == 2:
                # maxLife equation
                z[0] = 0.01 - np.e**(-(float(maxLife)/n)**b)
                pass
            elif list_[0] == 3:
                # mostLikely
                z[0] = n*(((b-1)/b)**(1/b)) - float(mostLikely)
                pass
            elif list_[0] == 4:
                if time_wo_failure:
                    z[0] = zero_failure_equation(n, b)
            # Equation 2
            if list_[1] == 1:
                # minLife equation
                z[1] = 0.99 - np.e**(-(float(minLife)/n)**b)
                pass
            elif list_[1] == 2:
                # maxLife equation
                z[1] = 0.01 - np.e**(-(float(maxLife)/n)**b)
                pass
            elif list_[1] == 3:
                # mostLikely
                z[1] = n*(((b-1)/b)**(1/b)) - float(mostLikely)
                pass
            elif list_[0] == 4:
                if time_wo_failure:
                    z[1] = zero_failure_equation(n, b)

            return z
        zGuess = np.array([1,1])
        n, b = fsolve(equations, zGuess)
        print("n value", n, "b value",b)
        return n, b

    def solve_failure_prob(self, data):
        xsData = []
        ysData = []
        for x in data:
            xsData.append(np.log(float(x["time"])))
            ysData.append(np.log(-np.log(1 - float(x["failureProb"])/100)))
        xs = np.array(xsData, dtype=np.float64)
        ys = np.array(ysData, dtype=np.float64)
        b = (((mean(xs) * mean(ys)) - mean(xs * ys)) /
             ((mean(xs) * mean(xs)) - mean(xs * xs)))
        c = ysData[0] - b*xsData[0]
        n = (2.718281828459045)**(-c/b)
        return n, b

    def solve_eta_beta_nprd(self, x):
        gamma_param = (1/float(x["beta"])) + 1
        def integrate_func(x22): return np.exp(-x22)*(x22**(gamma_param - 1))
        integrate_res = integrate.quad(integrate_func, 0, np.inf)
        eeta = 1/(float(x["failureRate"]) * integrate_res[0])
        print(eeta, x['beta'])
        return eeta, x['beta']

    def generate_TTF_points(self, eta, beta, num):
        dps = weibull_min.rvs(beta, loc=0, scale=eta, size=num)
        return dps

    def check_component_exists(self, component_id, dataTable):
        check_sql = '''select component_id from {} where component_id = ?'''.format(
            dataTable)
        cursor.execute(check_sql, component_id)
        exist = cursor.fetchone()
        if exist:
            return True
        else:
            False

    def check_TTF_num_priority_wise(self, n, b, component_id, priority, f_s='Failure'):
        select_sql = '''select * from TTF_data where priority < ?'''
        cursor.execute(select_sql, priority)
        rows = cursor.fetchall()
        num_to_generate_dps = 15 - len(rows)
        if num_to_generate_dps > 0:
            dps = self.generate_TTF_points(n, b, num_to_generate_dps)
            self.save_TTF(dps, component_id, priority, f_s)

    def save_TTF(self, data, component_id, priority, f_s):
        insert_sql = '''insert into TTF_data (id, hours, component_id, f_s, priority)
                            values (?,?,?,?,?);'''
        try:
            for dp in data:
                id = uuid4()
                cursor.execute(insert_sql, id, dp,
                               component_id, f_s, priority)
            return True
        except:
            return False

    def update_through_MLE(self, component_id):
        '''This function takes component id and checks if dps > 15 then if updated in 12 hours
        then return false and not update eta beta else update eta_beta'''
        select_sql = '''select * from TTF_data where component_id=? and priority = 1'''
        cursor.execute(select_sql, component_id)
        rows = cursor.fetchall()
        dps = []
        if len(rows) >= 15:
            for r in rows:
                dps.append(r[1])
        else:
            count = 15 - len(rows)
            select_extra_rows = '''select TOP(?) * from TTF_data where component_id=?
             and priority > 1'''
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

            update_sql = '''update eta_beta set eta=?, beta=? where component_id=?'''
            update_sql(update_sql, n, b, component_id)
            cnxn.commit()

    def insert_opdata(self, data):
        try:
            for d in data:
                id = d['oid']
                component_id = d['id']
                operation_date = d['Date']
                date_ = datetime.strptime(str(operation_date), "%B/%Y")
                average_running = d['AverageRunning']
                insert_opdata = '''insert into operational_data (id,
                                        component_id, operation_date,average_running)
                                        VALUES (?, ?, ?, ?);'''

                cursor.execute(insert_opdata, id, component_id, date_,
                               average_running)
            cnxn.commit()
            return self.success_return
        except Exception as e:
            self.error_return['message'] = str(e)
            return self.error_return

    def insert_maintenance_data(self, data):
        insert_sql = '''insert into data_manager_maintenance_data (id, component_id, event_type, maint_date, maintenance_type,
                                           replaced_component_type, cannabalised_age, maintenance_duration,
                                           failure_mode, description)
                                values (?,?,?,?,?,?,?,?,?,?)'''
        try:
            for d in data:
                id = d['id']
                component_id = d['component_id']
                event_type = d['EventType']
                date_ = d['Date']
                date_ = datetime.strptime(str(date_), "%d/%m/%Y")
                mType = d['MaintainanceType']
                replaceType = d['ReplaceType']
                cannAge = d['CannibalisedAge']
                MaintenanceDuration = float(d['MaintenanceDuration'])
                fm = d['FM']
                desc = d['Remark']
                self.maintenance_save_logic(d)
                cursor.execute(insert_sql, id, component_id, event_type, date_,
                               mType, replaceType, cannAge, MaintenanceDuration, fm, desc)

            cnxn.commit()
            return self.success_return
        except Exception as e:
            self.error_return['message'] = str(e)
            return self.error_return

    def maintenance_save_logic(self, d):
        latest_failure_date = '''select Top (1) maint_date from data_manager_maintenance_data where component_id = ? order by maint_date desc'''
        installation_date_sql = '''select installation_date from system_config_additional_info where component_id =?'''
        parent_system_id = '''select component_id from system_configuration where system_configuration.system in
                (select system from system_configuration where component_id = ?)
                    and system_configuration.ship_name in
                        (select ship_name from system_configuration where component_id = ?)
                and system_configuration.component_name in ((select system from system_configuration where component_id = ?))'''

        opr_date = '''select SUM(average_running) from operational_data where component_id = ?
         and (operation_date between ? and ?)'''

        component_id = d['component_id']
        date_ = d['Date']
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
            self.save_TTF([TTF], component_id, 1, 'Failure')
            return True

        return False

    def insert_overhauls(self,data):
        mainData = data[0]['mainData']
        subData = data[0]['subData']
        component_id = ""
        insert_sub_sql = '''insert into data_manager_overhauls_info (id, 
        component_id, overhaul_num, running_age, num_maintenance_event)
        values (?,?,?,?,?);'''
        insert_main_sql = '''insert into data_manager_overhaul_maint_data (id, 
        component_id, overhaul_id, "date", maintenance_type, running_age,
        associated_sub_system) values (?,?,?,?,?,?,?);'''
        failure_times = []
        running_age = []
        try:
            for d in subData:
                if d:
                    id = d['id']
                    overhaulNum = d["overhaulNum"]
                    runAge = d["runAge"]
                    running_age.append(float(runAge))
                    numMaint = d["numMaint"]
                    component_id = d["component_id"]
                    cursor.execute(insert_sub_sql, id, component_id,
                                   overhaulNum, runAge, numMaint)
        except Exception as e:
            pass

        try:
            for d in mainData:
                if d:
                    id = d['id']
                    overhaulId = d["overhaulId"]
                    date = d["date"]
                    date = datetime.strptime(date, "%d/%m/%Y")
                    maintenanceType = d["maintenanceType"]
                    totalRunAge = d["totalRunAge"]
                    failure_times.append(float(totalRunAge))
                    subSystemId = d["subSystemId"]
                    cursor.execute(insert_main_sql, id, component_id,
                                   overhaulId, date, maintenanceType, totalRunAge, subSystemId)
        except Exception as e:
            pass
        
        T = running_age[-1]
        N = len(failure_times)
        def para(N, x, T):
            beta = N / sum(math.log(T/i) for i in x)
            alpha = N / T**beta
            return(beta, alpha)
        alpha, beta = para(N, failure_times, T)
        print(alpha, beta)
        ## insert alpha beta temp now.
        alpha_beta_insert = '''insert into alpha_beta values(?,?,?,?)'''
        a_b_id = uuid.uuid4()
        cursor.execute(alpha_beta_insert, a_b_id, alpha, beta, component_id)
        cnxn.commit()