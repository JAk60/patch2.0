from backend.dB.dB_connection import cursor, cnxn
from flask import jsonify
from backend.dB.condition_monitoring.condition_monitoring_queries import (
    FETCH_SENSOR_BASED_DATA,
    FETCH_PARAMETER_DATA,
    FETCH_GRAPH_DATA,
)


class GraphDashBoard:

    def graph_c(self, equipment_ids):
        if not equipment_ids:
            return {"message": "Some Error Occured, Please try agian.", "code": 0}

        try:
            sensor_data = []
            parameter_data = []
            graphData = []

            for equipment_id in equipment_ids:
                cursor.execute(FETCH_SENSOR_BASED_DATA, (equipment_id,))
                result1 = cursor.fetchall()

                cursor.execute(FETCH_PARAMETER_DATA, (equipment_id,))
                result2 = cursor.fetchall()

                cursor.execute(FETCH_GRAPH_DATA, (equipment_id,))
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

            response = {
                "sensor_based_data": sensor_data,
                "parameter_data": parameter_data,
                "graphData": graphData,
            }
            return {"message": "Data Saved Successfully.", "code": 1, "response": response}

        except Exception as e:
            print(f"[GraphDashBoard] Error in graph_c: {e}")
            return {"message": f"Some Error Occured: {str(e)}", "code": 0}