from flask import Flask, json, session, request, jsonify, send_file
from datetime import datetime
import os
import io
from dB.dB_connection import cnxn, cursor
from os import listdir
from werkzeug.utils import secure_filename
from os.path import isfile, join
from classes.reliability import Reliability
from classes.trial2 import read_excel
from dB.data_manager.data_manager_dB import DataManagerDB
from dB.maintenance_allocation.maintenanceAllocation import maintenanceAllocation_dB
from dB.phase_manager.phase_manager_dB import Phase_Manager_dB
from dB.hep.hep_dB import Hep_dB
from dB.condition_monitoring.condition_monitoring import conditionMonitoring_dB
from dB.condition_monitoring.cgraph import GraphDashBoard
from dB.mission_profile import MissionProfile
from dB.data_manager.data_manager import Data_Manager
from dB.system_configuration.system_configurationdB_table import SystemConfigurationdBTable
from classes.System_Configuration_Netra import System_Configuration_N
from classes.custom_settings import Custom_Settings
from dB.task_configuration.task_configuration import taskConfiguration_dB
from dB.RUL.rul import RUL_dB
from classes.taskReliability import TaskReliability
from dB.dB_utility import add_user_selection_data
from dB.RCM.rcmDB import RCMDB
from dB.PM.optimize import optimizer
from dB.Authentication.signin import Authentication
import math
import numpy as np
# import malotlib.pyplot as plt
from scipy.stats import weibull_min
import copy
import numpy as np
import pandas as pd
import math

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

res = SystemConfigurationdBTable()


@app.route('/home')
def home():
    return jsonify("Hello, This is new. We have connected ports!!")


@app.route('/save_system', methods=['POST', 'GET'])
def save_system():
    if request.method == 'POST':
        sys_inst = System_Configuration_N()
        data = request.get_json(force=True)
        configData = data['flatData']
        dtype = data['dtype']
        print(configData, dtype)
        res = sys_inst.save_dataToDB(configData, dtype)
    else:
        pass
    return jsonify(res)


@app.route('/save_phase', methods=['POST', 'GET'])
def save_phase():
    if request.method == 'POST':
        phase_inst = Phase_Manager_dB()
        data = request.get_json(force=True)
        phaseData = data['flatData']
        dtype = data['dtype']
        res = phase_inst.save_dataToDB(phaseData, dtype)
    else:
        pass
    return jsonify(res)

@app.route('/save_hep', methods=['POST', 'GET'])
def save_hep():
    if request.method == 'POST':
        hep_inst = Hep_dB()
        data = request.get_json(force=True)
        hepData = data['flatData']
        dtype = data['dtype']
        res = hep_inst.save_dataToDB(hepData, dtype)
    else:
        pass
    return jsonify(res)


@app.route('/fetch_system', methods=['POST', 'GET'])
def fetch_system():
    if request.method == 'POST':
        data = request.get_json(force=True)
        print(data)
        conf_data = {
            "nomenclature": data["nomenclature"],
            "ship_name": data["ship_name"]
        }
        component_id = data['component_id']
        sys_inst = System_Configuration_N()
        res = sys_inst.fetch_system(conf_data,component_id)
        try:
            req_from = data['request_from']
            if req_from == "phase":
                phase_inst = Phase_Manager_dB()
                phase_d = phase_inst.fetch_phases(data)
                res = {'system_data': res, 'phase_data': phase_d}
            pass
        except:
            pass
    return jsonify(res)


# @app.route('/fetchFailureModes', methods=['GET'])
# def fetch_failure_modes():
#     if request.method == 'GET':
#         sys_inst = System_Configuration_N()
#         res = sys_inst.fetch_failure_modes()
#     return jsonify(res)


@app.route('/fmodes', methods=['POST'])  # Update the method to 'POST'
def fetch_failure_modes():
    if request.method == 'POST':
        data = request.json  # Assuming the request body contains JSON data
        component_id = data.get('component_id')  # Get the component_id from the request JSON
        sys_inst = System_Configuration_N()
        res = sys_inst.fmodesData(component_id)
        # Rest of the code to fetch failure modes based on the component_id
        # ...
        
        return jsonify(res)



@app.route('/save_system_redundancy', methods=['POST', 'GET'])
def save_system_redundancy():
    if request.method == 'POST':
        sys_inst = System_Configuration_N()
        data = request.get_json(force=True)
        configData = data['flatData']
        dtype = data['dtype']
        res = sys_inst.save_dataToDB(configData, dtype)
    else:
        pass
    return jsonify(res)


@app.route('/save_data_manager', methods=['POST', 'GET'])
def save_data_manager():
    if request.method == 'POST':
        d_inst = Data_Manager()
        data = request.get_json(force=True)
        configData = data['flatData']
        dtype = data['dtype']
        res = d_inst.save_dataToDB(configData, dtype)
    else:
        pass
    return jsonify(res)


@app.route('/mission_data', methods=['GET', 'POST'])
def mission_data():
    mission = MissionProfile()
    if request.method == 'POST':
        mission_data = request.get_json(force=True)
        mission_data = mission_data['mission_data']
        data = mission.insert_mission(mission_data)
    else:
        data = mission.select_mission()
    return data


@app.route('/fetch_user_selection', methods=['GET'])
def fetch_user_selection():
    custom = Custom_Settings()
    data = custom.fetch_user_selection()
    return data


@app.route('/rel_dashboard', methods=['GET', 'POST'])
def rel_dashboard():
    if request.method == 'GET':
        custom = Custom_Settings()
        data = custom.fetch_user_selection(toJson=False)
        mission = MissionProfile()
        data_m = mission.select_mission(toJson=False)
        f_data = {'mission_data': data_m, 'user_selection': data}
        return jsonify(f_data)

@app.route('/cm_dashboard', methods=['GET', 'POST'])
def cm_dashboard():
    if request.method == 'GET':
        custom = Custom_Settings()
        data = custom.fetch_user_selection(toJson=False)
        cm_inst = conditionMonitoring_dB()
        params = cm_inst.fetch_all_params()
        f_data = {'parameters': params, 'user_selection': data}
        return jsonify(f_data)




@app.route('/rel_estimate', methods=['POST'])
def rel_estimate():
    if request.method == 'POST':
        data = request.get_json(force=True)
        mission_data = data['data']['missions']
        eq_data = data['data']['equipments']
        temp_missions = data['data']['tempMissions']
        rel_inst = Reliability()
        res = rel_inst.mission_wise_rel(mission_data, eq_data, temp_missions)
        return jsonify(res)

@app.route('/rel_estimate_EQ', methods=['POST'])
def rel_estimateEQ():
    if request.method == 'POST':
        data = request.get_json(force=True)
        mission_data = data['data']['missions']
        # mission_data = int(mission_data)
        eq_data = data['data']['equipments']
        temp_missions = data['data']['tempMissions']
        nomenclatures = data['data']['nomenclature']
        rel_inst = Reliability()
        res = rel_inst.mission_wise_rel_systemEQ(mission_data, eq_data, nomenclatures, temp_missions)
        return jsonify(res)


@app.route('/update_parameters', methods=['POST'])
def update_parameters():
    if request.method == 'POST':
        data = request.get_json(force=True)
        d_inst = Data_Manager()
        res = d_inst.update_parameters(data)
        return jsonify(res)


@app.route('/save_historical_data', methods=['POST'])
def save_historical_data():
    if request.method == 'POST':
        data = request.get_json(force=True)
        data = data['data']
        d_inst = Data_Manager()
        res = d_inst.insert_data(data)
        return jsonify(res)

@app.route('/add_data', methods=['POST'])
def add_data():
    if request.method == 'POST':
        try:
            data = request.get_data()
            print(data)
            return jsonify(data)
        except Exception as e:
            return jsonify(e)
        # d_inst = maintenanceAllocation_dB()
        # res = d_inst.insert_data(data)
        # return jsonify(res)


@app.route('/change', methods=['GET', 'POST'])
def trial():
    data = Reliability()
    d = [{'platform': 'Talwar 1', 'system': 'DA2'}]
    m = {'mission_name': 'Mission A'}
    rel_val = data.system_rel(m, d)
    return str(rel_val)

#Condition Monitoring Routes 
@app.route('/save_condition_monitoring', methods=['POST', 'GET'])
def save_condition_monitoring():
    if request.method == 'POST':
        cm_inst = conditionMonitoring_dB()
        data = request.get_json(force=True)
        cmData = data['flatData']
        dtype = data['dtype']
        res = cm_inst.save_dataToDB(cmData, dtype)
    return jsonify("data saved to database")

    
@app.route('/fetch_params', methods=['POST', 'GET'])
def fetch_parameters():
    if request.method == 'POST':
        cm_inst = conditionMonitoring_dB()
        data = request.get_json(force=True)
        cId = data['ComponentId']
        res = cm_inst.fetch_params(cId)
        print(res)
    else:
        pass
    return jsonify(res)


@app.route('/fetch_cmdata', methods=['POST', 'GET'])
def fetch_cmdata():
    if request.method == 'POST':
        cm_inst = conditionMonitoring_dB()
        data = request.get_json(force=True)
        eIds=data['EquipmentIds']
        pNames=data['ParameterNames']
        res= cm_inst.fetch_cmdata(eIds,pNames)
    return jsonify(res)

#TASK CONFIGURATION
@app.route('/fetch_tasks', methods=['GET', 'POST'])
def fetch_tasks():
    if request.method == 'GET':
        path='./tasks'
        taskfiles = [f for f in listdir(path) if isfile(join(path, f))]
        tasknames=[]
        for file in taskfiles:
            tasknames.append(file.split(".")[0])
        t_data={'tasks':tasknames }
        return jsonify(t_data)
@app.route('/save_task_configuration', methods=['POST'])
def save_task_configuration():
    if request.method == 'POST':
        tc_inst = TaskReliability()
        data = request.get_json(force=True)
        taskData = data['taskData']
        taskDataf = filter(lambda x : x["type"] == "component", taskData)
        taskDataf = map(tc_inst.get_eq_id, taskDataf)
        taskDataNC = filter(lambda x : x["type"] != "component", taskData)
        taskData = list(taskDataNC) + list(taskDataf)

        # Check if any task has k values that exceed n
        invalid_tasks = []
        for item in taskData:
            if item['type'] == 'component' and 'n' in item['data']:
                exceeded_k_values = [k_key for k_key in ['k', 'k_as', 'k_c', 'k_ds', 'k_elh'] if k_key in item['data'] and item['data'][k_key] > item['data']['n']]
                if exceeded_k_values:
                    invalid_tasks.append((item['data']['label'], exceeded_k_values))

        if invalid_tasks:
            messages = []
            for task_label, exceeded_k_values in invalid_tasks:
                message = f"Equipment '{task_label}' has exceeded the n value for the following k values: {', '.join(exceeded_k_values)}."
                messages.append(message)
            res = {
                "message": " ".join(messages),
                "code": 0
            }
            return jsonify({"error": res}), 400
        else:
            try:
                # Save valid data
                json_object = json.dumps(taskData, indent=4)
                directory = "./tasks/"
                filename = taskData[0]['data']['label'] + ".json"
                file_path = os.path.join(directory, filename)
                if not os.path.isdir(directory):
                    os.mkdir(directory)
                with open(file_path, "w") as file:
                    file.write(json_object)

                res = {
                    "message": "Data Saved Successfully.",
                    "code": 1
                }
            except Exception as e:
                res = {
                    "message": str(e),
                    "code": 0
                }
    else:
        res = {
            "message": "Invalid request method.",
            "code": 0
        }

    return jsonify(res)


@app.route('/load_task_configuration', methods=['POST', 'GET'])
def load_task_configuration():
    if request.method == 'POST':
        # tc_inst = taskConfiguration_dB()
        data = request.get_json(force=True)
        taskName = data['taskName']
        file_path='./tasks/'+taskName+'.json'
        file = open(file_path, "r")
        return jsonify(json.load(file))

@app.route('/task_rel', methods=['POST', 'GET']) 
def task_rel():
    data = request.get_json(force=True)
    tasks = []
    trel_inst = TaskReliability()
    final_return_data = []
    for d in data:
        if type(d) is not bool:
            if len(d) != 0:
                shipname = d["shipName"]
                taskName = d["taskName"]    
                missionDataDuration = d["data"]
                cal_rel = d["cal_rel"]
                missionName ='A'
                rel = trel_inst.task_new_rel(taskName, missionName, missionDataDuration, APP_ROOT, shipname)
                print(rel)
                final_return_data.append({"shipName": shipname, "taskName": taskName, 
                                        "rel": rel["task_rel"], "data": rel["all_missionRel"], "cal_rel": cal_rel}) 
    # name = data["taskName"][0]["name"]
    
    # missionDataDuration = data["missionProfileData"
    return jsonify(final_return_data)

@app.route('/task_dash_populate', methods=['POST', 'GET'])
def task_dash_populate():
    trel_inst = TaskReliability()
    data = trel_inst.get_task_dropdown_data(APP_ROOT)
    return jsonify(data)

@app.route('/addUserSelectionData', methods=['POST', 'GET'])
def addUserSelectionData():
    data = request.get_json(force=True)
    try:
        add_user_selection_data(data)
    except Exception as e:
        return jsonify({"message": str(e), "code": 0})
    return jsonify({"message":"Data Saved Sucessfully!!", "code": 1}) 

@app.route('/fetch_condition_monitoring', methods=['POST'])
def fetch_condition_monitoring():
    data = request.get_json(force=True)
    req_type = data["type"]
    data = data["system"]
    try:
        cm = conditionMonitoring_dB()
        data = cm.fetch_data_for_display(data, req_type)
    except Exception as e:
        return jsonify({"message": str(e), "code": 0})
    return jsonify(data)        


###### RCM Routes ######
@app.route('/save_assembly_rcm', methods=['POST'])
def save_assembly_rcm():
    data = request.get_json(force=True)
    rcm = RCMDB()
    res = rcm.save_asm(data)    
    return res

@app.route('/fetch_assembly_rcm', methods=['POST'])
def fetch_assembly_rcm():
    data = request.get_json(force=True)
    sys_inst = System_Configuration_N()
    component_id = sys_inst.fetch_component_id(data["ship_name"], data["nomenclature"])
    res = sys_inst.fetch_system(data, component_id)
    rcm = RCMDB()
    res_r = rcm.fetch_saved_asm(data)    
    res["asm"] = res_r
    return res

@app.route('/save_rcm', methods=['POST'])
def save_rcm():
    # data = request.get_json(force=True)
    # sys_inst = System_Configuration_N()
    # res = sys_inst.fetch_system(data)
    data = request.get_json(force=True)
    rcm = RCMDB()
    res_r = rcm.save_component_rcm(data)    
    return res_r

@app.route('/rcm_report', methods=['POST', 'GET'])
def rcm_report():
    # data = request.get_json(force=True)
    # sys_inst = System_Configuration_N()
    # res = sys_inst.fetch_system(data)
    data = request.get_json(force=True)
    system = data["nomenclature"]
    ship_name = data["ship_name"]
    rcm = RCMDB()
    res_r = rcm.generate_rcm_report(APP_ROOT, system , ship_name)  
    target = os.path.join(APP_ROOT, 'netra\public\{0}-{1}.pdf'.format(ship_name.replace(' ',''), system.replace(' ','')))  
    return jsonify({"res": res_r, "system": system, "ship_name": ship_name})
    
@app.route('/upload', methods=['POST', 'GET'])
def fileUpload():
    if request.method == 'POST':
        file = request.files.getlist('file')
        ss = request.form.get("system")
        pl = request.form.get("name")
        target_folder = os.path.join(APP_ROOT, 'netra\public\{0}_{1}'.format(pl.replace(" ", ""), ss.replace(" ", "")))
        if not os.path.exists(target_folder):
            os.mkdir(target_folder)
        for f in file:
            filename = secure_filename(f.filename)
            f.save(os.path.join(target_folder, filename))
        return jsonify({"name": filename, "status": "success"})
    else:
        return jsonify({"status": "failed"})
    
@app.route('/fetch_system_files', methods=['POST', 'GET'])
def fetch_system_files():
    if request.method == 'POST':
        data = request.get_json(force=True)
        ss = data["system"]
        pl = data["ship_name"]
        target_folder = os.path.join(APP_ROOT, 'netra\public\{0}_{1}'.format(pl.replace(" ", ""), ss.replace(" ", "")))
        files = os.listdir(target_folder)
        return jsonify({"files": files})
    else:
        return jsonify({"status": "failed"})
    

@app.route('/optimize', methods=['POST'])
def optimize():
    if request.method== 'POST':
        data = request.json
        print(data)
        return optimizer()
    
# @app.route('/rul', methods=['POST'])
# def rul():
#     if request.method== 'POST':
#         file_path = os.path.join(app.config['UPLOAD_FOLDER'], 'uploaded_data.csv')
#         return rul_code(file_path)

@app.route('/rul', methods=['POST'])
def rul():
    if request.method== 'POST':

        # file_path = os.path.join(app.config['UPLOAD_FOLDER'], 'uploaded_data.csv')
        inst = RUL_dB()
        return inst.rul_code()
 

# @app.route('/prev_rul', methods=['POST'])
# def prev_rul():
#     try:
#         data = request.get_json()
#         parameter = data['parameter']
#         equipment_id = data['equipment_id']
#         print(parameter, equipment_id)
#         rul_class = RUL_dB()
#         result = rul_class.get_prev_rul(parameter, equipment_id)
#         return result
#     except Exception as e:
#         # Handle any exceptions and return an error message
#         print(e)
#         return jsonify({"message": "Invalid request format."}), 400


@app.route('/csv_upload', methods=['POST'])
def predict_rul():
    if 'file' in request.files:
        file = request.files['file']
        # Assuming the uploaded file is a CSV file
        # You can modify the file processing based on your file format
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], 'uploaded_data.csv')
        file.save(file_path)

        return "file saved"

    else:
        # If the file is not provided, load the previously saved CSV file
        return "file is not provided"


@app.route("/cgraph", methods=["POST"])
def cgraph():
    data = request.get_json()
    equipment_id = data.get('equipment_id')
    graph=GraphDashBoard()
    return graph.graph_c(equipment_id)


@app.route("/get_pf", methods=["POST"])
def pf():
    data = request.get_json()
    # equipment_id = data.get('equipment_id')
    name = data.get('name')
    equipment_id = data.get('equipment_id')
    rul_class = RUL_dB()
    return rul_class.fetch_PF(name, equipment_id)

@app.route('/get_credentials', methods=['POST'])
def get_credentials():
    data = request.json  # Assuming you send a JSON object in the request body
    if 'username' in data and 'password' in data:
        username = data['username']
        password = data['password']
        inst = Authentication()
        return inst.sign_in(username, password)


@app.route('/insert_user', methods=['POST'])
def insert_new_user():
    data = request.json  # Assuming you send a JSON object in the request body
    if 'username' in data and 'password' in data and 'level' in data:
        username = data['username']
        password = data['password']
        level = data['level']
        inst = Authentication()
        return inst.sign_up(username, password, level)


@app.route('/fetch_eta_beta', methods=['POST'])
def fetch_eta_beta():
    data = request.json
    component_id = data['component_id']
    inst = Data_Manager()
    return inst.fetch_eeta_beta(component_id)


@app.route('/phase_json', methods=['POST'])
def phasejson():
    data = request.json
    PhaseInfo = data["PhaseInfo"]
    durations = data["duration"]
    curr_task = data["task_name"]
    inst = TaskReliability()
    return inst.json_paraser(APP_ROOT, PhaseInfo, durations, curr_task)


@app.route('/get_ship_alpha_beta', methods=['POST'])
def fetch_equipment_alpha_betas():
    data = request.json
    ship_name = data["ship_name"]
    components = data["equipments"]
    inst = Data_Manager()
    return inst.fetch_alpha_beta(components=components)


@app.route('/update_alpha_beta', methods=['POST'])
def update_alpha_beta():
    data = request.json
    ship_name = data['ship_name']
    component_name = data['equipment_name']
    alpha = data['alpha']
    beta = data['beta']
    inst = Data_Manager()
    return inst.update_alpha_beta(ship_name=ship_name, component_name=component_name, alpha=alpha, beta=beta)


@app.route('/component_overhaul_age', methods=['POST'])
def set_component_overhaul_age():
    data = request.json
    age = data['age']
    ship_name = data['ship_name']
    component_name = data['equipment_name']
    inst = Data_Manager()
    return inst.set_component_overhaul_age(ship_name, component_name, age)


if __name__ == '__main__':
    app.secret_key = os.urandom(32)

    app.run(debug=True)
