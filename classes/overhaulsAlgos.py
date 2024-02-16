from dB.dB_connection import cursor, cnxn
from datetime import datetime, timedelta
import uuid
import math


class OverhaulsAlgos:
   
    def days_addition_logic(self, equipment_id):
        query = "SELECT TOP 5 average_running FROM operational_data WHERE component_id = ? ORDER BY average_running DESC"
        cursor.execute(query, equipment_id)
        results = cursor.fetchall()
        num_rows = len(results)
        while num_rows < 5:
            results.append((0,))
            num_rows += 1
        total_average = sum(row[0] for row in results)
        days = total_average / 5 / 30
        return days

    def insert_overhauls_data(self, equipment_id, run_age_component):
        try:
            new_data = []
            clk_reset = 0
            index = 0
            empty_age_query = "UPDATE data_manager_overhaul_maint_data SET running_age=NULL, cmms_running_age=NULL"
            cursor.execute(empty_age_query)
            cnxn.commit()

            query = "SELECT * FROM data_manager_overhaul_maint_data where component_id = ? AND running_age is NULL ORDER BY date"
            cursor.execute(query, equipment_id)
            data = cursor.fetchall()
            data = self.historic_data_interpolation(data=data, component_id=equipment_id)
            days = self.days_addition_logic(equipment_id)
            prev_date = None
            multiplication_factor = 1

            for row in data:
                (
                    id,
                    component_id,
                    overhaul_id,
                    date,
                    maintenance_type,
                    running_age,
                    associated_sub_system,
                    cmms_running_age,
                ) = row
                cmms_running_age = float(cmms_running_age)
                if date is None:
                    if prev_date:
                        date = datetime.strptime(str(prev_date), "%Y-%m-%d") + timedelta(
                            days=days
                        )
                        date = date.strftime("%Y-%m-%d")
                if clk_reset == 0:
                    if cmms_running_age < run_age_component:
                        running_age = cmms_running_age
                        new_data.append(
                            (
                                id,
                                component_id,
                                overhaul_id,
                                date,
                                maintenance_type,
                                running_age,
                                associated_sub_system,
                                cmms_running_age,
                            )
                        )
                    elif cmms_running_age == run_age_component:
                        maintenance_type = "Overhaul"
                        running_age = cmms_running_age
                        new_data.append(
                            (
                                id,
                                component_id,
                                overhaul_id,
                                date,
                                maintenance_type,
                                running_age,
                                associated_sub_system,
                                cmms_running_age,
                            )
                        )
                        clk_reset += 1
                    else:
                        maintenance_type = "Overhaul"
                        prev_date = data[index - 1][3]
                        date = datetime.strptime(prev_date, "%Y-%m-%d") + timedelta(
                            days=days
                        )
                        date = date.strftime("%Y-%m-%d")
                        new_data.append(
                            (
                                id,
                                component_id,
                                overhaul_id,
                                date,
                                maintenance_type,
                                run_age_component,
                                associated_sub_system,
                                run_age_component,
                            )
                        )
                        id = uuid.uuid4()
                        clk_reset += 1
                        age = abs(float(cmms_running_age) - run_age_component * clk_reset)
                        running_age = age
                        maintenance_type = "Corrective Maintainance"
                        new_data.append(
                            (
                                id,
                                component_id,
                                overhaul_id,
                                prev_date,
                                maintenance_type,
                                running_age,
                                associated_sub_system,
                                cmms_running_age,
                            )
                        )
                else:
                    age = abs(float(cmms_running_age) - run_age_component * clk_reset)
                    if age < run_age_component:
                        running_age = age
                        new_data.append(
                            (
                                id,
                                component_id,
                                overhaul_id,
                                date,
                                maintenance_type,
                                running_age,
                                associated_sub_system,
                                cmms_running_age,
                            )
                        )
                    elif age == run_age_component:
                        maintenance_type = "Overhaul"
                        multiplication_factor += 1
                        running_age = age
                        new_data.append(
                            (
                                id,
                                component_id,
                                overhaul_id,
                                date,
                                maintenance_type,
                                running_age,
                                associated_sub_system,
                                run_age_component * multiplication_factor,
                            )
                        )
                        clk_reset += 1
                    else:
                        maintenance_type = "Overhaul"
                        id = uuid.uuid4()
                        running_age = age
                        multiplication_factor += 1
                        prev_date = data[index - 1][3]
                        date = datetime.strptime(prev_date, "%Y-%m-%d") + timedelta(
                            days=days
                        )
                        date = date.strftime("%Y-%m-%d")
                        new_data.append(
                            (
                                id,
                                component_id,
                                overhaul_id,
                                date,
                                maintenance_type,
                                run_age_component,
                                associated_sub_system,
                                run_age_component * multiplication_factor,
                            )
                        )
                        id = uuid.uuid4()
                        clk_reset += 1
                        age = abs(float(cmms_running_age) - run_age_component * clk_reset)
                        running_age = age
                        maintenance_type = "Corrective Maintainance"
                        new_data.append(
                            (
                                id,
                                component_id,
                                overhaul_id,
                                prev_date,
                                maintenance_type,
                                running_age,
                                associated_sub_system,
                                cmms_running_age,
                            )
                        )
                index += 1
                prev_date = date
            if len(new_data) != 0:
                query = "DELETE FROM data_manager_overhaul_maint_data WHERE component_id = ?"
                cursor.execute(query, equipment_id)
                cnxn.commit()
                insert_query = """
                    INSERT INTO data_manager_overhaul_maint_data (id, 
                    component_id, overhaul_id, date, maintenance_type, running_age,
                    associated_sub_system, cmms_running_age) VALUES (?,?,?,?,?,?,?,?)
                """
                for d in new_data:
                    cursor.execute(insert_query, d)
                cnxn.commit()
        except Exception as e:
            print("OVERHAULS ALGO")
            print(e)
            pass

    def equipment_failure_times(self, input_data):
        failure_times = []
        # overhaul_data = {}
        present_overhaul_data = []
        for data in input_data:
            if data is None:
                continue
            else:
                if data["maintenanceType"] == "Overhaul":
                    present_overhaul_data.append(float(data["totalRunAge"]))
                    failure_times.append(present_overhaul_data)
                    present_overhaul_data = []
                else:
                    present_overhaul_data.append(float(data["totalRunAge"]))
                    
        if(len(present_overhaul_data)  != 0):
            failure_times.append(present_overhaul_data)
        return failure_times

        # for data in input_data:
        #     if data is None:
        #         continue
        #     overhaul_id = data.get("overhaulId")
        #     if overhaul_id:
        #         total_run_age = float(data.get("totalRunAge", 0))
        #         if overhaul_id in overhaul_data:
        #             overhaul_data[overhaul_id].append(total_run_age)
        #         else:
        #             overhaul_data[overhaul_id] = [total_run_age]
        #     else:
        #         total_run_age = float(data.get("totalRunAge", 0))
        #         present_overhaul_data.append(total_run_age)
        #         # failure_times.append([total_run_age])

        # for overhaul_id, data in overhaul_data.items():
        #     failure_times.append(data)
        # failure_times.append(present_overhaul_data)
        # return failure_times

    def extract_running_ages(self, sub_data, failure_times):
        run_age = [float(entry["runAge"]) for entry in sub_data][0]
        running_ages = []
        if run_age not in failure_times:
            running_ages.append(run_age)
        else:
            running_ages = [i[-1] for i in failure_times]
        return running_ages
        # for data in reversed(main_data):
        #     if data is None:
        #         continue
        #     if "overhaulId" not in data:
        #         last_run_age = float(data.get("runningAge", 0))
        #         break

        # if last_run_age is not None:
        #     run_ages.append(last_run_age)

        # return run_ages

    def alpha_beta_calculation(self, mainData, subData, id):
        failure_times = self.equipment_failure_times(mainData)
        N = [len(subarray) for subarray in failure_times]
        T = self. extract_running_ages(sub_data=subData, failure_times=failure_times)
        print(f"FALIURE TIMES: {failure_times}")
        print(f"N: {N}")
        print(f"T: {T}")
        def para(N, x, T, k):
            beta = (sum(n for n in N)) / (sum(sum(math.log(t /
                                                        x[T.index(t)][i]) for i in range(N[T.index(t)])) for t in T))
            alpha = (sum(n for n in N)) / (sum(t**beta for t in T))
            return alpha, beta
        alpha, beta = para(N, failure_times, T, k=len(failure_times))
        
        a_b_id = uuid.uuid4()
        merge_query = '''
            MERGE INTO alpha_beta AS target
            USING (VALUES (?, ?, ?, ?)) AS source (id, component_id, alpha, beta)
            ON target.component_id = source.component_id
            WHEN MATCHED THEN
                UPDATE SET alpha = source.alpha, beta = source.beta
            WHEN NOT MATCHED THEN
                INSERT (id, component_id, alpha, beta)
                VALUES (source.id, source.component_id, source.alpha, source.beta);
        '''

        # Assuming you have appropriate values for 'component_id', 'alpha', and 'beta'
        cursor.execute(merge_query, (a_b_id, id, alpha, beta))
        cnxn.commit()

    def _get_interpolated_age(self, date, component_id):
        query = "SELECT SUM(average_running) FROM operational_data WHERE operation_date<?  AND component_id = ?"
        cursor.execute(query, date, component_id)
        age = cursor.fetchone()[0]
        date = datetime.strptime(date, '%Y-%m-%d')
        utilization_date = f"{date.year}-{date.month}-01"
        sql = "SELECT average_running FROM operational_data where operation_date=? and component_id=?"
        cursor.execute(sql, utilization_date, component_id)
        result = cursor.fetchone()
        if result: 
            utilization = result[0]
        else:
            utilization = 0
        if utilization == 0:
            # query = "SELECT TOP 5 average_running FROM operational_data WHERE component_id = ? ORDER BY average_running DESC"
            # cursor.execute(query, component_id)
            # results = sum(row[0] for row in cursor.fetchall())
            # daily_avg = results / 5 * 30
            return age
        else:
            daily_avg = utilization / 30
        age = age + daily_avg * int(date.day) 
        return age


    def historic_data_interpolation(self, data, component_id):
        interpolated_data = []
        for item in data:
            if item[-1] == None or item[-1] == '0' or item[-1] == '':
                age = self._get_interpolated_age(date=item[3], component_id=component_id)
                item[-1] = age
            interpolated_data.append(item)
        return interpolated_data
                





