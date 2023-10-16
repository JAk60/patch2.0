from dB.dB_connection import cursor, cnxn
from flask import jsonify


class GraphDashBoard:
    def __init__(self):
        self.success_return = {"message": "Data Saved Successfully.", "code": 1}
        self.error_return = {
            "message": "Some Error Occured, Please try agian.",
            "code": 0,
        }

    def graph_c(self, equipment_ids):
        if equipment_ids:
            sensor_data = []
            parameter_data = []
            graphData = []

            for equipment_id in equipment_ids:
                # Query 1: Fetch data from sensor_based_data table
                query1 = """
                    SELECT component_id, equipment_id, failure_mode_id, name, min_value, max_value, unit
                    FROM sensor_based_data
                    WHERE equipment_id = ? 
                """
                cursor.execute(query1, (equipment_id,))
                result1 = cursor.fetchall()

                # Query 2: Fetch data from parameter_data table
                query2 = """
                    SELECT component_id, name, date, value, operating_hours
                    FROM parameter_data
                    WHERE component_id = ? 
                """
                cursor.execute(query2, (equipment_id,))
                result2 = cursor.fetchall()

                # Query 3: Fetch joined data from sensor_based_data and parameter_data tables
                query3 = """
                    SELECT 
                    pc.component_name, pc.nomenclature,
                    p.name, p.value, p.date,
                    s.equipment_id, p.operating_hours, s.min_value, s.max_value, s.failure_mode_id, s.unit
                    FROM parameter_data p
                    JOIN sensor_based_data s ON p.parameter_id = s.id
                    JOIN system_configuration pc ON p.component_id = pc.component_id
                    WHERE pc.component_id = ?;
                """
                cursor.execute(query3, (equipment_id,))
                result3 = cursor.fetchall()

                for row in result1:
                    sensor_data.append(
                        {
                            "component_id": row[0],
                            "equipment_id": row[1],
                            "failure_mode_id": row[2],
                            "name": row[3],
                            "min_value": row[4],
                            "max_value": row[5],
                            "unit": row[6],
                        }
                    )

                for row in result2:
                    parameter_data.append(
                        {
                            "component_id": row[0],
                            "name": row[1],
                            "date": row[2],
                            "value": row[3],
                            "operating_hours": row[4],
                        }
                    )

                for row in result3:
                    graphData.append(
                        {
                            "component_name": row[0],
                            "nomenclature": row[1],
                            "name": row[2],
                            "value": row[3],
                            "date": row[4],
                            "equipment_id": row[5],
                            "operating_hours": row[6],
                            "min_value": row[7],
                            "max_value": row[8],
                            "failure_mode_id": row[9],
                            "unit": row[10],
                        }
                    )

            # Create a dictionary to hold the results of all queries
            response = {
                "sensor_based_data": sensor_data,
                "parameter_data": parameter_data,
                "graphData": graphData,
            }
            self.success_return["response"] = response
            return self.success_return
        else:
            return self.error_return
