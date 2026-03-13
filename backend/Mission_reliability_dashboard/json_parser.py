from dB.dB_connection import cnxn, cursor
import numpy as np
from itertools import groupby
from operator import itemgetter
import pandas as pd
import json
import os
from dB.mission_profile import MissionProfile
from flask import jsonify
from datetime import datetime
import copy
import numpy as np
import pandas as pd
import math
from backend.Mission_reliability_dashboard import query 

class TaskJsonParser:

    def load_json(self, APP_ROOT, curr_task):
        target_path = os.path.join(APP_ROOT, 'tasks/')
        file = f"{curr_task}.json"
        target = os.path.join(APP_ROOT, 'tasks/' + file)
        return json.load(open(target))


    def extract_components(self, json_data):

        objects_array = []

        for item in json_data:

            obj = {
                "id": item.get("id"),
                "label": item.get("data", {}).get("label"),
                "parallel_comp": item.get("data", {}).get("parallel_comp"),
                "k": item.get("data", {}).get("k"),
                "k_as": item.get("data", {}).get("k_as"),
                "k_c": item.get("data", {}).get("k_c"),
                "k_ds": item.get("data", {}).get("k_ds"),
                "k_elh": item.get("data", {}).get("k_elh"),
            }

            objects_array.append(obj)

        return objects_array
    
    def build_label_groups(self, objects_array):
        data = []
        unique_combinations = set()

        for single_object in objects_array:
            k_values = {
                'Harbour': single_object.get('k'),
                'Action Station': single_object.get('k_as'),
                'Cruise': single_object.get('k_c'),
                'Defense Station': single_object.get('k_ds'),
                'Entry Leaving Harbour': single_object.get('k_elh')
            }

            label = single_object.get('label')
            label_group = [label] if label else []
            parallel_comp = single_object.get('parallel_comp')

            if parallel_comp:
                for comp in parallel_comp:
                    comp_label = comp.get('label')
                    if comp_label:
                        label_group.append(comp_label)
            sorted_label_group = ', '.join(sorted(label_group))

            for k_name, k_value in k_values.items():
                if k_value is not None:
                    current_combination = (sorted_label_group, k_name)
                    if current_combination not in unique_combinations:
                        unique_combinations.add(current_combination)
                        data.append({
                            'Label_Group': sorted_label_group,
                            'Phase': k_name,
                            'K_Value': k_value,
                            'N': len(label_group)
                        })

        return data
    

    def convert_dataframe_to_list(self, data):

        df = pd.DataFrame(data)

        data_list_dict = df.to_dict()
        data_list = []

        for index in range(len(data_list_dict['Label_Group'])):
            row_dict = {
                'Label_Group': data_list_dict['Label_Group'][index],
                'Phase': data_list_dict['Phase'][index],
                'K_Value': data_list_dict['K_Value'][index],
                'N': data_list_dict['N'][index]
            }
            data_list.append(row_dict)

        return data_list

    def prepare_group_inputs(self, data_list, equipment_ids, running_ages):
        result = []
        label_groups = list(set(entry['Label_Group'] for entry in data_list))

        for phase in set(entry['Phase'] for entry in data_list):
            phase_data = [
                entry for entry in data_list if entry['Phase'] == phase
            ]
            for label_group in label_groups:
                labels = label_group.split(', ')
                alpha_data = [equipment_ids[label][0] for label in labels]
                beta_data = [equipment_ids[label][1] for label in labels]
                running_age_data = [
                    running_ages[label] for label in labels
                ]
                label_group_data = [
                    entry for entry in phase_data
                    if entry['Label_Group'] == label_group
                ]
                if label_group_data:
                    k_value = label_group_data[0]['K_Value']
                    n_value = label_group_data[0]['N']

                    result.append([
                        phase,
                        labels,
                        alpha_data,
                        beta_data,
                        running_age_data,
                        k_value,
                        n_value
                    ])

        return result
    
