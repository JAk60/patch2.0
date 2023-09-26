from dB.dB_connection import cursor, cnxn
from flask import jsonify, request
from scipy.stats import weibull_min
import numpy as np
import math
from mpmath import mp


class RUL_dB:
    parameter = None
    component_id = None
    def __init__(self):
        self.success_return = {"message": "Data Retrieved Successfully.", "code": 1}
        self.error_return = {"message": "Some Error Occurred, Please try again.", "code": 0}

    # def get_prev_rul(self, p, equipment_id):
    #     try:
    #         # RUL_dB.component_id = equipment_id
    #         sql = "SELECT TOP 1 * FROM parameter_data WHERE name = ? and component_id= ?  ORDER BY date desc"
    #         cursor.execute(sql, p, equipment_id)
    #         # RUL_dB.parameter = p
    #         data = cursor.fetchone()

    #         if data:
    #             # Extract the desired columns from the result row
    #             data_value = data[3]  # Assuming data_value is the first column
    #             name = data[4]        # Assuming name is the second column
    #             operating_hours = data[6]  # Assuming operating_hours is the third column

    #             # Return the retrieved data in a dictionary format
    #             return {
    #                 "data_value": data_value,
    #                 "name": name,
    #                 "operating_hours": operating_hours,
    #             }
    #         else:
    #             # Return an error message if no data is found
    #             self.error_return['message'] = str(e)
    #             return self.error_return
    #     except Exception as e:
    #         # Handle any exceptions and return an error message
    #         self.error_return['message'] = str(e)
    #         return self.error_return

    def fetch_PF(self, name, equipment_id):
        try:
            # SQL query
            sql_query = '''
                SELECT P, F
                FROM sensor_based_data
                WHERE name = ? and component_id= ?
            '''

            # Execute the query
            cursor.execute(sql_query,name, equipment_id)

            # Fetch all rows
            data = cursor.fetchall()

            # Convert the data to a list of dictionaries
            result = []
            for row in data:
                result.append({'P': row[0], 'F': row[1]})

            return jsonify(result)
        except Exception as e:
            # Handle any exceptions that might occur during the execution
            print(f"Error occurred: {str(e)}")
            return jsonify({'error': 'An error occurred.'}), 500

    
    def rul_code(self):
        req_data = request.get_json()
        try:
            query = '''
                SELECT operating_hours, value from parameter_data WHERE name = ? and component_id = ?
            '''
            parameter = req_data["parameter"]
            equipment_id = req_data["equipmentId"]
            cursor.execute(query, parameter, equipment_id)
            data = cursor.fetchall()
            data = [(x, float(y)) for x, y in data]

            # Extract input values from JSON data
            vc = data[-1][0]  # Sensor value
            t0 = data[-2][1] # Current time
            tp = data[-1][1]
            p = req_data['p']
            f = req_data['f']
            confidence_levels =[0.8, 0.85, 0.9, 0.95]
            print(req_data)
            threshold = f
            idx = []
            result = []
            current_group = []

            for item in data:
                if not current_group or item[0] >= current_group[-1][0]:
                    current_group.append(item)
                else:
                    result.append(current_group)
                    current_group = [item]

            # Append the last group
            result.append(current_group)

            # Store operating hours where threshold is first reached in another array
            operating_hours_threshold_reached = []

            for group in result:
                threshold_reached = False
                for item in group:
                    if item[1] >= threshold:
                        operating_hours_threshold_reached.append(item[0])
                        threshold_reached = True
                        break


            # # Estimate beta and eta using MLE
            print(data)
            if len(operating_hours_threshold_reached) ==0:
                return self.error_return
            params = weibull_min.fit(operating_hours_threshold_reached, floc=0)

            # # Unpack the estimated parameters
            beta, eta = params[0], params[2]
            remaining_life_results = []

            for confidence in confidence_levels:
                def rul(eta, beta, t0):
                    eta = round(eta, 2) 
                    beta = round(beta, 2) 
                    t0 = round(t0, 2) 
                    print(beta, eta, t0)
                    reliability = math.exp(-((t0 / eta) ** beta))
                    t = (eta * (-math.log(reliability * confidence)) ** (1 / beta)) - t0
                    return t

                # tp = t0 - 100
                if (vc < p):
                    rulp = rul(eta, beta, tp)
                    rulc = rul(eta, beta, t0)
                else:
                    m = abs((f - vc)) / (f - p)
                    etac = eta * m
                    rulp = rul(etac, beta, tp)
                    rulc = rul(etac, beta, t0)

                # if rulc is less than rulp then take rulc else rulp
                remaining_life = rulc if rulc < rulp else rulp
                remaining_life_results.append(remaining_life)

            # Return the result as JSON
            return jsonify({"confidence": confidence_levels, "remaining_life": remaining_life_results})
        except Exception as e:
            self.error_return['message'] = str(e)
            return self.error_return

