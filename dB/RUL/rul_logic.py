from flask import request
import math
import os
from scipy.stats import weibull_min
import numpy as np
import pandas as pd
from flask import jsonify
from dB.dB_connection import cursor


def rul_code(file_path):
    data = request.get_json()
    print(data)

    # Extract input values from JSON data
    vc = data['vc']  # Sensor value
    t0 = data['t0']  # Current time
    tp = data['tp']
    p = data['p']
    f = data['f']
    confidence = data['confidence']

    data = pd.read_csv(file_path)
    


    dataset = {}
    idx = []

    for col in data.columns[1:]:
        dataset_name = col.strip()  # Remove any leading/trailing spaces from column names
        dataset = data[['t', col]].copy()
        dataset.columns = ['t', 'sensor_value']  # Rename the columns

        # Find the index where the threshold limit is first reached
        first_threshold_index = dataset[dataset['sensor_value'] > f].index.min()
        time_value = data.iloc[first_threshold_index, data.columns.get_loc("t")]
        idx.append(time_value)
    print(idx)
    # Sample time-to-failure data
    datattf = np.array(idx)

    # Estimate beta and eta using MLE
    params = weibull_min.fit(datattf, floc=0)

    # Unpack the estimated parameters
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
