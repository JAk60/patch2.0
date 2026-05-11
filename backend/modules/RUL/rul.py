from backend.dB.dB_connection import cursor, cnxn
from flask import jsonify, request
from scipy.stats import weibull_min
import numpy as np
import math
from mpmath import mp
from backend.dB.Rul_queries.Rul_queries import (
    FETCH_PF_VALUES,
    FETCH_PF_BY_COMPONENT_AND_PARAM,
    FETCH_OPERATING_HOURS_AND_VALUE,
    FETCH_SENSORS_BY_COMPONENT,
    FETCH_SENSOR_NAMES_BY_COMPONENT,
)

class RUL_dB:
    parameter = None
    component_id = None

    def __init__(self):
        self.success_return = {
            "message": "Data Retrieved Successfully.", "code": 1}
        self.error_return = {
            "message": "Some Error Occurred, Please try again.", "code": 0}

    def fetch_PF(self, name, equipment_id):
        try:
            cursor.execute(FETCH_PF_VALUES, name, equipment_id)
            data = cursor.fetchall()

            result = []
            for row in data:
                result.append({'P': row[0], 'F': row[1]})

            self.success_return["results"] = result
            return self.success_return

        except Exception as e:
            self.error_return["messege"] = str(e)
            self.error_return

    def rul_code(self, equipment_id, parameter):
        req_data = request.get_json()
        try:
            cursor.execute(FETCH_PF_BY_COMPONENT_AND_PARAM, equipment_id, parameter)
            pf_result = cursor.fetchone()
            if pf_result is None:
                self.error_return["message"] = "P and F values not found in the database"
                return self.error_return
            p, f = pf_result

            cursor.execute(FETCH_OPERATING_HOURS_AND_VALUE, parameter, equipment_id)
            data = cursor.fetchall()
            data = [(x, float(y)) for x, y in data]

            vc = data[-1][0]
            t0 = data[-2][1]
            tp = data[-1][1]

            confidence_levels = [0.8, 0.85, 0.9, 0.95]
            threshold = f
            print(threshold)
            idx = []
            result = []
            current_group = []

            for item in data:
                if not current_group or item[0] >= current_group[-1][0]:
                    current_group.append(item)
                else:
                    result.append(current_group)
                    current_group = [item]

            result.append(current_group)

            operating_hours_threshold_reached = []

            for group in result:
                threshold_reached = False
                for item in group:
                    if item[1] >= threshold:
                        operating_hours_threshold_reached.append(item[0])
                        threshold_reached = True
                        break

            if len(operating_hours_threshold_reached) == 0:
                self.error_return["message"] = "Not enough datasets"
                return self.error_return
            params = weibull_min.fit(operating_hours_threshold_reached, floc=0)

            beta, eta = params[0], params[2]
            remaining_life_results = []

            for confidence in confidence_levels:
                def rul(eta, beta, t0):
                    eta = round(eta, 2)
                    beta = round(beta, 2)
                    t0 = round(t0, 2)
                    print(beta, eta, t0)
                    reliability = math.exp(-((t0 / eta) ** beta))
                    t = (eta * (-math.log(reliability * confidence))
                         ** (1 / beta)) - t0
                    return t

                if (vc < p):
                    rulp = rul(eta, beta, tp)
                    rulc = rul(eta, beta, t0)
                else:
                    m = abs((f - vc)) / (f - p)
                    etac = eta * m
                    rulp = rul(etac, beta, tp)
                    rulc = rul(etac, beta, t0)

                remaining_life = rulc if rulc < rulp else rulp
                remaining_life_results.append(remaining_life)

            self.success_return["results"] = {
                "P": p,
                "F": f,
                "confidence": confidence_levels,
                "remaining_life": remaining_life_results,
                "Table": {
                    "0.8": remaining_life_results[0],
                    "0.85": remaining_life_results[1],
                    "0.9": remaining_life_results[2],
                    "0.95": remaining_life_results[3]
                }
            }
            return self.success_return

        except Exception as e:
            print(e)
            self.error_return['message'] = str(e)
            return self.error_return

    def rul_equipment_level(self):
        req_data = request.get_json()
        try:
            equipment_id = req_data["equipmentId"]

            cursor.execute(FETCH_SENSORS_BY_COMPONENT, equipment_id)
            remaining_life_results = {}
            data = cursor.fetchall()

            for id, name, p, f in data:
                cursor.execute(FETCH_OPERATING_HOURS_AND_VALUE, name, equipment_id)
                sensor_data = cursor.fetchall()
                sensor_data = [(x, float(y)) for x, y in sensor_data]
                vc = sensor_data[-1][0]
                t0 = sensor_data[-2][1]
                tp = sensor_data[-1][1]
                rul_data = self.rul_code(equipment_id, name)
                if rul_data["code"] == 1:
                    remaining_life_results[name] = rul_data["results"]["remaining_life"][-2]

            self.success_return["results"] = remaining_life_results
            print(self.success_return)
            return self.success_return

        except Exception as e:
            self.error_return["error"] = str(e)
            return self.error_return

    def fetch_specific_sensors(self, data):
        print(data)
        cursor.execute(FETCH_SENSOR_NAMES_BY_COMPONENT, (data,))
        sensor_data = cursor.fetchall()
        sensor_data = [row.name for row in sensor_data]
        return jsonify(sensor_data)