from dB.dB_connection import cursor, cnxn
from datetime import datetime, timedelta
import uuid
from dB.Data_Adminstrator.data_adminstrator import Data_Administrator


class OverhaulsAlgos:

    def overhaul_date_calculation(self, component_id, overhaul_frequency_hour, previous_age, current_date, previous_date):
        """
        Calculate overhaul date based on previous running age.

        Args:
            previous_age: The cmms_running_age from the PREVIOUS row in the loop (pass it directly)
        """
        if previous_age is None:
            return None

        remaining_hours = overhaul_frequency_hour - previous_age

        query = """SELECT AVG(average_running)
                    FROM (
                    SELECT TOP 5 average_running
                    FROM operational_data
                    WHERE component_id = ?
                    AND operation_date <= ?
                    AND average_running > 0
                    ORDER BY operation_date DESC
                ) AS TopFive;
                """
        cursor.execute(query, component_id, current_date)
        results = cursor.fetchone()

        if results and results[0] is not None:
            daily_average = results[0] / 30
        else:
            return None

        if daily_average == 0:
            return None

        days_until_overhaul = remaining_hours / daily_average
        estimated_overhaul_date = datetime.strptime(previous_date, "%Y-%m-%d") + timedelta(days=days_until_overhaul)
        print(f"Estimated overhaul date for component {component_id} is: {estimated_overhaul_date.strftime('%Y-%m-%d')}")
        return estimated_overhaul_date.strftime("%Y-%m-%d")

    def insert_overhauls_data(self, equipment_id, run_age_component):
        query = "SELECT ship_name,nomenclature FROM system_configuration where component_id = ?"
        cursor.execute(query, equipment_id)
        odata = cursor.fetchall()
        ship_name, nomenclature = odata[0]

        inst = Data_Administrator()
        inst.overhaul_data_reset(component_id=equipment_id, nomenclature=nomenclature, ship_name=ship_name)
        new_data = []
        clk_reset = 0
        index = 0

        query = "SELECT * FROM data_manager_overhaul_maint_data where component_id = ? AND running_age is NULL ORDER BY date"
        cursor.execute(query, equipment_id)
        odata = cursor.fetchall()
        if not odata:
            return False
        try:
            data = self.historic_data_interpolation(data=odata, component_id=equipment_id)

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

                if clk_reset == 0:
                    if cmms_running_age < run_age_component:
                        running_age = cmms_running_age
                        age = cmms_running_age
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
                            previous_date=prev_date
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
                        age = abs(float(cmms_running_age) - run_age_component * clk_reset)
                        running_age = age
                        maintenance_type = "Corrective Maintainance"
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
                        prev_row = data[index - 1]
                        previous_cmms_age = prev_row[7]
                        prev_date = data[index - 1][3]
                        overhaul_date = self.overhaul_date_calculation(
                            component_id=component_id,
                            overhaul_frequency_hour=run_age_component,
                            previous_age=previous_cmms_age,
                            current_date=date,
                            previous_date=prev_date
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
                        age = abs(float(cmms_running_age) - run_age_component * clk_reset)
                        running_age = age
                        maintenance_type = "Corrective Maintainance"
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

    def _get_interpolated_cmms_running_age(self, date, component_id):
        query = "SELECT SUM(average_running) FROM operational_data WHERE operation_date<=? AND component_id = ?"
        cursor.execute(query, (date, component_id))
        cumulative_age = cursor.fetchone()[0]
        from datetime import datetime

        date_obj = datetime.strptime(date, '%Y-%m-%d')
        day = date_obj.day

        first_of_month = date_obj.replace(day=1).strftime('%Y-%m-%d')

        query = '''
            SELECT AVG(average_running) 
            FROM (
                SELECT TOP 5 average_running 
                FROM operational_data 
                WHERE component_id = ?
                AND operation_date <= ?
                AND average_running > 0
                ORDER BY operation_date DESC
            ) AS LastFive;
        '''
        cursor.execute(query, (component_id, first_of_month))
        result = cursor.fetchone()

        monthly_average = result[0] if result and result[0] is not None else 0

        interpolated_age = cumulative_age + (monthly_average / 30) * day

        return interpolated_age

    def historic_data_interpolation(self, data, component_id):
        interpolated_data = []
        for item in data:
            if item[-1] == None or item[-1] == '0' or item[-1] == '':
                age = self._get_interpolated_cmms_running_age(date=item[3], component_id=component_id)
                item[-1] = age
            interpolated_data.append(item)
        return interpolated_data
