from dB.dB_connection import cursor, cnxn
from flask import jsonify, request
from scipy.stats import weibull_min
import numpy as np
import math

class RUL_dB:
    parameter = None
    component_id = None
    def __init__(self):
        self.success_return = {"message": "Data Retrieved Successfully.", "code": 1}
        self.error_return = {"message": "Some Error Occurred, Please try again.", "code": 0}

    def get_prev_rul(self, p, equipment_id):
        try:
            RUL_dB.component_id = equipment_id
            sql = "SELECT TOP 1 * FROM parameter_data WHERE name = ? and component_id= ?  ORDER BY date DESC"
            cursor.execute(sql, p, RUL_dB.component_id)
            RUL_dB.parameter = p
            data = cursor.fetchone()

            if data:
                # Extract the desired columns from the result row
                data_value = data[3]  # Assuming data_value is the first column
                name = data[4]        # Assuming name is the second column
                operating_hours = data[6]  # Assuming operating_hours is the third column

                # Return the retrieved data in a dictionary format
                return {
                    "data_value": data_value,
                    "name": name,
                    "operating_hours": operating_hours,
                }
            else:
                # Return an error message if no data is found
                return {
                    "message": f"No data found for name '{p}'.",
                }
        except Exception as e:
            # Handle any exceptions and return an error message
            return {
                "message": str(e),
                "code": 0
            }

    def fetch_PF(self, name):
        try:
            # SQL query
            sql_query = '''
                SELECT P, F
                FROM sensor_based_data
                WHERE name = ? and component_id= ?
            '''

            # Execute the query
            cursor.execute(sql_query,name, RUL_dB.component_id)

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
        data = request.get_json()
        query = '''
            SELECT operating_hours, value from parameter_data WHERE name = ? and component_id = ?
        '''
        cursor.execute(query, RUL_dB.parameter, RUL_dB.component_id)
        dataset = cursor.fetchall()
        print(data)

        # Extract input values from JSON data
        vc = data['vc']  # Sensor value
        t0 = data['t0']  # Current time
        tp = data['tp']
        p = data['p']
        f = data['f']
        confidence = data['confidence']

        idx = []

        for t, sensor_val in dataset:
            first_threshold = float(sensor_val) > f
            if first_threshold:
                idx.append(float(t))
        datattf = np.array(idx)

        # # Estimate beta and eta using MLE
        params = weibull_min.fit(datattf, floc=0)

        # # Unpack the estimated parameters
        beta, eta = params[0], params[2]
        print(beta, eta)

        def rul(eta, beta, t0):
            reliability = math.e ** -((t0 / eta) ** beta)
            print(confidence, reliability)
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

        # Return the result as JSON
        return jsonify({"remaining_life": remaining_life})

