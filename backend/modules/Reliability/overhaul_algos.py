from backend.dB.dB_connection import cursor, cnxn
from datetime import datetime, timedelta
import uuid
from backend.modules.View_update.CMMSTONETRA.data_adminstrator import Data_Administrator
from backend.dB.Reliability import query as q
from datetime import datetime, date as date_cls

class OverhaulsAlgos:
    def overhaul_date_calculation(
        self,
        component_id,
        overhaul_frequency_hour,
        previous_age,
        current_date,
        previous_date,
    ):
        if previous_age is None:
            return None
        remaining_hours = overhaul_frequency_hour - previous_age
        cursor.execute(q.GET_TOP5_AVG_RUNNING, (component_id, current_date))
        results = cursor.fetchone()
        if not results or results[0] is None:
            return None
        daily_average = results[0] / 30
        if daily_average == 0:
            return None
        days_until_overhaul = remaining_hours / daily_average
        if isinstance(previous_date, str):
            previous_date = datetime.strptime(previous_date, "%Y-%m-%d")
        elif isinstance(previous_date, date_cls) and not isinstance(previous_date, datetime):
            previous_date = datetime.combine(previous_date, datetime.min.time())
            
        estimated_overhaul_date = previous_date + timedelta(days=days_until_overhaul)
        return estimated_overhaul_date.strftime("%Y-%m-%d")

    def insert_overhauls_data(self, equipment_id, run_age_component):

        cursor.execute(q.GET_SHIP_AND_NOMENCLATURE, (equipment_id,))
        odata = cursor.fetchone()
        if not odata:
            return False
        ship_name, nomenclature = odata
        inst = Data_Administrator()
        inst.overhaul_data_reset(
            component_id=equipment_id,
            nomenclature=nomenclature,
            ship_name=ship_name,
        )
        new_data = []
        clk_reset = 0
        index = 0
        multiplication_factor = 1
        cursor.execute(q.GET_OVERHAUL_MAINT_DATA, (equipment_id,))
        odata = cursor.fetchall()
        if not odata:
            return False
        try:
            data = self.historic_data_interpolation(
                data=odata,
                component_id=equipment_id,
            )
            prev_date = None
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
                        prev_row = data[index - 1]
                        previous_cmms_age = prev_row[7]
                        prev_date = data[index - 1][3]
                        overhaul_date = self.overhaul_date_calculation(
                            component_id=component_id,
                            overhaul_frequency_hour=run_age_component,
                            previous_age=previous_cmms_age,
                            current_date=date,
                            previous_date=prev_date,
                        )
                        new_data.append(
                            (
                                id,
                                component_id,
                                overhaul_id,
                                overhaul_date,
                                maintenance_type,
                                run_age_component,
                                associated_sub_system,
                                run_age_component,
                            )
                        )
                        id = uuid.uuid4()
                        clk_reset += 1
                        age = abs(
                            float(cmms_running_age)
                            - run_age_component * clk_reset
                        )
                        maintenance_type = "Corrective Maintainance"
                        new_data.append(
                            (
                                id,
                                component_id,
                                overhaul_id,
                                date,
                                maintenance_type,
                                age,
                                associated_sub_system,
                                cmms_running_age,
                            )
                        )
                else:
                    age = abs(float(cmms_running_age) - run_age_component * clk_reset)                   
                    if age < run_age_component:
                        new_data.append(
                            (
                                id,
                                component_id,
                                overhaul_id,
                                date,
                                maintenance_type,
                                age,
                                associated_sub_system,
                                cmms_running_age,
                            )
                        )
                    elif age == run_age_component:
                        maintenance_type = "Overhaul"
                        multiplication_factor += 1
                        new_data.append(
                            (
                                id,
                                component_id,
                                overhaul_id,
                                date,
                                maintenance_type,
                                age,
                                associated_sub_system,
                                run_age_component * multiplication_factor,
                            )
                        )
                        clk_reset += 1
                    else:
                        maintenance_type = "Overhaul"
                        id = uuid.uuid4()
                        multiplication_factor += 1
                        prev_row = data[index - 1]
                        previous_cmms_age = prev_row[7]
                        prev_date = data[index - 1][3]
                        overhaul_date = self.overhaul_date_calculation(
                            component_id=component_id,
                            overhaul_frequency_hour=run_age_component,
                            previous_age=previous_cmms_age,
                            current_date=date,
                            previous_date=prev_date,
                        )
                        new_data.append(
                            (
                                id,
                                component_id,
                                overhaul_id,
                                overhaul_date,
                                maintenance_type,
                                run_age_component,
                                associated_sub_system,
                                run_age_component * multiplication_factor,
                            )
                        )
                        id = uuid.uuid4()
                        clk_reset += 1
                        age = abs(
                            float(cmms_running_age)
                            - run_age_component * clk_reset
                        )
                        maintenance_type = "Corrective Maintainance"
                        new_data.append(
                            (
                                id,
                                component_id,
                                overhaul_id,
                                date,
                                maintenance_type,
                                age,
                                associated_sub_system,
                                cmms_running_age,
                            )
                        )
                index += 1
                prev_date = date
            if new_data:
                cursor.execute(
                    q.DELETE_OVERHAUL_MAINT_DATA,
                    (equipment_id,),
                )
                cnxn.commit()

                for d in new_data:
                    cursor.execute(q.INSERT_OVERHAUL_MAINT_DATA, d)
                cnxn.commit()
        except Exception as e:
            print("OVERHAULS ALGO ERROR:", e)
            pass

    def _get_interpolated_cmms_running_age(self, date, component_id):

        if isinstance(date, str):
            date = datetime.strptime(date, "%Y-%m-%d").date()

        
        if isinstance(date, str):
            date = datetime.strptime(date, "%Y-%m-%d").date()
        elif isinstance(date, datetime):
            date = date.date()

        date_str = date.strftime("%Y-%m-%d")

        cursor.execute(q.GET_CUMULATIVE_RUNNING, (date_str, component_id))
        row = cursor.fetchone()
        cumulative_age = row[0] if row else 0
        day = date.day
        first_of_month = date.replace(day=1).strftime("%Y-%m-%d")
        cursor.execute(q.GET_TOP5_AVG_RUNNING, (component_id, first_of_month))
        result = cursor.fetchone()
        monthly_average = result[0] if result and result[0] else 0
        interpolated_age = cumulative_age + (monthly_average / 30) * day
       
        return interpolated_age
    
    def historic_data_interpolation(self, data, component_id):
        interpolated_data = []
        for item in data:

            item = list(item)
            if item[-1] is None or item[-1] in ("0", ""):
                age = self._get_interpolated_cmms_running_age(
                    date=item[3],
                    component_id=component_id,
                )
                item[-1] = age
            interpolated_data.append(tuple(item))
        return interpolated_data
