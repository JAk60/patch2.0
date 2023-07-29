from dB.dB_connection import cursor, cnxn
from flask import jsonify

class GraphDashBoard:
    def __init__(self):
        pass
    
    def graph_c(self, equipment_id):
        # Query 1: Fetch data from sensor_based_data table
        query1 = """
            SELECT component_id, equipment_id, failure_mode_id, name, min_value, max_value, unit
            FROM sensor_based_data
            WHERE equipment_id = ? 
        """
        cursor.execute(query1, (equipment_id))
        result1 = cursor.fetchall()

        # Query 2: Fetch data from parameter_data table
        query2 = """
            SELECT component_id, name, date, value, operating_hours
            FROM parameter_data
            WHERE component_id = ? 
        """
        cursor.execute(query2, (equipment_id))
        result2 = cursor.fetchall()

        # Query 3: Fetch joined data from sensor_based_data and parameter_data tables
        query3 = """
            SELECT p.name, p.value, p.date, s.equipment_id, p.operating_hours, s.min_value, s.max_value, s.failure_mode_id, s.unit
            FROM sensor_based_data AS s
            INNER JOIN parameter_data AS p ON s.name = p.name
        """
        cursor.execute(query3)
        result3 = cursor.fetchall()

        sensor_data = []
        for row in result1:
            sensor_data.append({
                'component_id': row[0],
                'equipment_id': row[1],
                'failure_mode_id': row[2],
                'name': row[3],
                'min_value': row[4],
                'max_value': row[5],
                'unit': row[6]
            })

        parameter_data = []
        for row in result2:
            parameter_data.append({
                'component_id': row[0],
                'name': row[1],
                'date': row[2],
                'value': row[3],
                'operating_hours': row[4]
            })

        graphData = []
        for row in result3:
            graphData.append({
                'name': row[0],
                'value': row[1],
                'date': row[2],
                'equipment_id': row[3],
                'operating_hours': row[4],
                'min_value': row[5],
                'max_value': row[6],
                'failure_mode_id': row[7],
                'unit': row[8]
            })

        # Create a dictionary to hold the results of all queries
        response = {
            'sensor_based_data': sensor_data,
            'parameter_data': parameter_data,
            'graphData': graphData
        }

        return jsonify(response)
