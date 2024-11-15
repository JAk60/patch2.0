import io
import os
from datetime import datetime
from os import listdir 
from os.path import isfile, join

import requests
from flask import (Flask, json, jsonify, request, send_file,
                   send_from_directory, session)
from flask_apscheduler import APScheduler
from flask_mail import Mail, Message
from werkzeug.utils import secure_filename

import middleware
from classes.custom_settings import Custom_Settings
from classes.reliability import Reliability
from classes.System_Configuration_Netra import System_Configuration_N
from classes.taskReliability import TaskReliability
from dB.Authentication.signin import Authentication
from dB.condition_monitoring.cgraph import GraphDashBoard
from dB.condition_monitoring.condition_monitoring import conditionMonitoring_dB
from dB.Dashboard.DashBoard import DashBoard
from dB.Data_Adminstrator.data_adminstrator import Data_Administrator
from dB.data_manager.data_manager import Data_Manager
from dB.data_manager.data_manager_dB import DataManagerDB
from dB.dB_connection import cnxn, cursor
from dB.dB_utility import add_user_selection_data
from dB.ETL.sourceData import ETL
from dB.hep.hep_dB import Hep_dB
from dB.maintenance_allocation.maintenanceAllocation import \
    maintenanceAllocation_dB
from dB.mission_profile import MissionProfile
from dB.Oem_Upload.oem import OEMData
from dB.password_reset.passwordReset import EmailSender
from dB.phase_manager.phase_manager_dB import Phase_Manager_dB
from dB.PM.optimize import optimizer
from dB.RCM.rcmDB import RCMDB
from dB.RUL.rul import RUL_dB
from dB.system_configuration.system_configurationdB_table import \
    SystemConfigurationdBTable
from dB.task_configuration.task_configuration import taskConfiguration_dB

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__)

scheduler = APScheduler()

# Configuring the Flask app to use the scheduler
app.config['SCHEDULER_API_ENABLED'] = True
scheduler.init_app(app)

# Configure Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.ethereal.email'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'favian.jacobs@ethereal.email'
app.config['MAIL_PASSWORD'] = 'bstZAfTvzfUHs56uva'
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False

mail = Mail(app)
with app.open_resource("./dB/password_reset/netra.png") as fp:
    logo_data = fp.read()

UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

res = SystemConfigurationdBTable()


def hit_srcetl_endpoint():
    endpoint_url = "http://127.0.0.1:5000/srcetl"  # Update with your actual URL
    response = requests.get(endpoint_url)
    print(f"Response from /srcetl endpoint: {response.text}")

# Schedule the task to run every 5 seconds


@scheduler.task('interval', id='hit_srcetl', days=5, misfire_grace_time=10)
def scheduled_task():
    hit_srcetl_endpoint()


@app.route("/home")
def home():
    return jsonify("Hello, This is new. We have connected ports!!")


@app.route("/save_system", methods=["POST", "GET"])
def save_system():
    if request.method == "POST":
        sys_inst = System_Configuration_N()
        data = request.get_json(force=True)
        configData = data["flatData"]
        dtype = data["dtype"]
        print(configData, dtype)
        res = sys_inst.save_dataToDB(configData, dtype)
    else:
        pass
    return jsonify(res)


@app.route("/save_phase", methods=["POST", "GET"])
def save_phase():
    if request.method == "POST":
        phase_inst = Phase_Manager_dB()
        data = request.get_json(force=True)
        phaseData = data["flatData"]
        dtype = data["dtype"]
        res = phase_inst.save_dataToDB(phaseData, dtype)
    else:
        pass
    return jsonify(res)


@app.route("/save_hep", methods=["POST", "GET"])
def save_hep():
    if request.method == "POST":
        hep_inst = Hep_dB()
        data = request.get_json(force=True)
        hepData = data["flatData"]
        dtype = data["dtype"]
        res = hep_inst.save_dataToDB(hepData, dtype)
    else:
        pass
    return jsonify(res)


@app.route("/fetch_system", methods=["POST", "GET"])
def fetch_system():
    if request.method == "POST":
        data = request.get_json(force=True)
        conf_data = {
            "nomenclature": data["nomenclature"],
            "ship_name": data["ship_name"],
        }
        component_id = data["component_id"]
        sys_inst = System_Configuration_N()
        res = sys_inst.fetch_system(conf_data, component_id)
        try:
            req_from = data["request_from"]
            if req_from == "phase":
                phase_inst = Phase_Manager_dB()
                phase_d = phase_inst.fetch_phases(data)
                res = {"system_data": res, "phase_data": phase_d}
            pass
        except:
            pass
    return jsonify(res)


@app.route("/fmodes", methods=["POST"])  # Update the method to 'POST'
def fetch_failure_modes():
    if request.method == "POST":
        data = request.json  # Assuming the request body contains JSON data
        component_id = data.get(
            "component_id"
        )  # Get the component_id from the request JSON
        sys_inst = System_Configuration_N()
        res = sys_inst.fmodesData(component_id)
        # Rest of the code to fetch failure modes based on the component_id
        # ...

        return jsonify(res)


@app.route("/save_system_redundancy", methods=["POST", "GET"])
def save_system_redundancy():
    if request.method == "POST":
        sys_inst = System_Configuration_N()
        data = request.get_json(force=True)
        configData = data["flatData"]
        dtype = data["dtype"]
        res = sys_inst.save_dataToDB(configData, dtype)
    else:
        pass
    return jsonify(res)


@app.route("/save_data_manager", methods=["POST", "GET"])
def save_data_manager():
    if request.method == "POST":
        d_inst = Data_Manager()
        data = request.get_json(force=True)
        configData = data["flatData"]
        dtype = data["dtype"]
        res = d_inst.save_dataToDB(configData, dtype)
    else:
        pass
    return jsonify(res)


@app.route("/mission_data", methods=["GET", "POST"])
def mission_data():
    mission = MissionProfile()
    if request.method == "POST":
        mission_data = request.get_json(force=True)
        mission_data = mission_data["mission_data"]
        data = mission.insert_mission(mission_data)
    else:
        data = mission.select_mission()
    return data


@app.route("/fetch_user_selection", methods=["GET"])
def fetch_user_selection():
    custom = Custom_Settings()
    data = custom.fetch_user_selection()
    return data


@app.route("/rel_dashboard", methods=["GET", "POST"])
def rel_dashboard():
    if request.method == "GET":
        custom = Custom_Settings()
        data = custom.fetch_user_selection(toJson=False)
        mission = MissionProfile()
        data_m = mission.select_mission(toJson=False)
        f_data = {"mission_data": data_m, "user_selection": data}
        return jsonify(f_data)


@app.route("/fetch_sensors", methods=["POST"])
def fetch_sensors():
    data = request.get_json()
    inst = RUL_dB()
    response = inst.fetch_specific_sensors(data)
    return response


@app.route("/cm_dashboard", methods=["GET", "POST"])
def cm_dashboard():
    if request.method == "GET":
        custom = Custom_Settings()
        data = custom.fetch_user_selection(toJson=False)
        cm_inst = conditionMonitoring_dB()
        params = cm_inst.fetch_all_params()
        f_data = {"parameters": params, "user_selection": data}
        return jsonify(f_data)


@app.route("/rel_estimate", methods=["POST"])
def rel_estimate():
    if request.method == "POST":
        data = request.get_json(force=True)
        mission_data = data["data"]["missions"]
        eq_data = data["data"]["equipments"]
        temp_missions = data["data"]["tempMissions"]
        rel_inst = Reliability()
        res = rel_inst.mission_wise_rel(mission_data, eq_data, temp_missions)
        return jsonify(res)


@app.route("/rel_estimate_EQ", methods=["POST"])
def rel_estimateEQ():
    if request.method == "POST":
        data = request.get_json(force=True)
        mission_data = data["data"]["missions"]
        # mission_data = int(mission_data)
        eq_data = data["data"]["equipments"]
        temp_missions = data["data"]["tempMissions"]
        nomenclatures = data["data"]["nomenclature"]
        rel_inst = Reliability()
        res = rel_inst.mission_wise_rel_systemEQ(
            mission_data, eq_data, nomenclatures, temp_missions
        )
        return jsonify(res)


@app.route("/update_parameters", methods=["POST"])
def update_parameters():
    if request.method == "POST":
        data = request.get_json(force=True)
        d_inst = Data_Manager()
        res = d_inst.update_parameters(data)
        return jsonify(res)


@app.route("/save_historical_data", methods=["POST"])
def save_historical_data():
    if request.method == "POST":
        data = request.get_json(force=True)
        print("data",data)
        if data and "data" in data:
            data = data["data"]
            d_inst = Data_Manager()
            res = d_inst.insert_data(data)
            print(res)
            return jsonify({"code": 1, "message": "Data Saved Successfully", "result": res})
        else:
            return jsonify({"code": 0, "message": "Invalid data format"}), 400


@app.route("/add_data", methods=["POST"])
def add_data():
    if request.method == "POST":
        try:
            data = request.get_data()
            print(data)
            return jsonify(data)
        except Exception as e:
            return jsonify(e)
        # d_inst = maintenanceAllocation_dB()
        # res = d_inst.insert_data(data)
        # return jsonify(res)


@app.route("/change", methods=["GET", "POST"])
def trial():
    data = Reliability()
    d = [{"platform": "Talwar 1", "system": "DA2"}]
    m = {"mission_name": "Mission A"}
    rel_val = data.system_rel(m, d)
    return str(rel_val)


# Condition Monitoring Routes
@app.route("/save_condition_monitoring", methods=["POST", "GET"])
def save_condition_monitoring():
    if request.method == "POST":
        cm_inst = conditionMonitoring_dB()
        data = request.get_json(force=True)
        cmData = data["flatData"]
        dtype = data["dtype"]
        res = cm_inst.save_dataToDB(cmData, dtype)
    return res


@app.route("/fetch_params", methods=["POST", "GET"])
def fetch_parameters():
    if request.method == "POST":
        cm_inst = conditionMonitoring_dB()
        data = request.get_json(force=True)
        cId = data["ComponentId"]
        res = cm_inst.fetch_params(cId)
    else:
        pass
    return jsonify(res)


@app.route("/fetch_cmdata", methods=["POST", "GET"])
def fetch_cmdata():
    if request.method == "POST":
        cm_inst = conditionMonitoring_dB()
        data = request.get_json(force=True)
        eIds = data["EquipmentIds"]
        pNames = data["ParameterNames"]
        res = cm_inst.fetch_cmdata(eIds, pNames)
    return jsonify(res)


# TASK CONFIGURATION
# @app.route("/fetch_tasks", methods=["GET", "POST"])
# def fetch_tasks():
#     if request.method == "GET":
#         path = "./tasks"
#         taskfiles = [f for f in listdir(path) if isfile(join(path, f))]
#         tasknames = []
#         for file in taskfiles:
#             tasknames.append(file.split(".")[0])
#         t_data = {"tasks": tasknames}
#         return jsonify(t_data)
import json
from flask import jsonify, request
from os import listdir
from os.path import isfile, join

@app.route("/fetch_tasks", methods=["GET", "POST"])
def fetch_tasks():
    if request.method == "GET":
        path = "./tasks"
        taskfiles = [f for f in listdir(path) if isfile(join(path, f))]
        
        # Initialize an empty list for the output
        tasks_info = []

        # Process each task file
        for file in taskfiles:
            task_name = file.split(".")[0]  # Get the task name without the extension
            
            # Read the contents of the task file
            with open(join(path, file), 'r') as f:
                task_data = json.load(f)  # Load the JSON data
                
                # Ensure task_data is a list and get the last object
                if isinstance(task_data, list) and task_data:
                    last_object = task_data[-1]  # Get the last object in the array
                    author_name = last_object.get("shipName")  # Get the author's name from the key 'name'
                    
                    # Create a dictionary for the current task
                    task_info = {
                        "taskname": task_name,
                        "ship_name": author_name
                    }
                    
                    # Add the task info to the list
                    tasks_info.append(task_info)
        return jsonify(tasks_info)



@app.route("/save_task_configuration", methods=["POST"])
def save_task_configuration():
    if request.method == "POST":
        tc_inst = TaskReliability()
        data = request.get_json(force=True)
        taskData = data["taskData"]
        taskDataf = filter(lambda x: x["type"] == "component", taskData)
        taskDataf = map(tc_inst.get_eq_id, taskDataf)
        taskDataNC = filter(lambda x: x["type"] != "component", taskData)
        taskData = list(taskDataNC) + list(taskDataf)

        # Check if any task has k values that exceed n
        invalid_tasks = []
        for item in taskData:
            if item["type"] == "component" and "n" in item["data"]:
                exceeded_k_values = [
                    k_key
                    for k_key in ["k", "k_as", "k_c", "k_ds", "k_elh"]
                    if k_key in item["data"] and item["data"][k_key] > item["data"]["n"]
                ]
                if exceeded_k_values:
                    invalid_tasks.append(
                        (item["data"]["label"], exceeded_k_values))

        if invalid_tasks:
            messages = []
            for task_label, exceeded_k_values in invalid_tasks:
                message = f"Equipment '{task_label}' has exceeded the n value for the following k values: {', '.join(exceeded_k_values)}."
                messages.append(message)
            res = {"message": " ".join(messages), "code": 0}
            return jsonify({"error": res}), 400
        else:
            try:
                # Save valid data
                json_object = json.dumps(taskData, indent=4)
                directory = "./tasks/"
                filename = taskData[0]["data"]["label"] + ".json"
                file_path = os.path.join(directory, filename)
                if not os.path.isdir(directory):
                    os.mkdir(directory)
                with open(file_path, "w") as file:
                    file.write(json_object)

                res = {"message": "Data Saved Successfully.", "code": 1}
            except Exception as e:
                res = {"message": str(e), "code": 0}
    else:
        res = {"message": "Invalid request method.", "code": 0}

    return jsonify(res)


@app.route("/load_task_configuration", methods=["POST", "GET"])
def load_task_configuration():
    if request.method == "POST":
        # tc_inst = taskConfiguration_dB()
        data = request.get_json(force=True)
        taskName = data["taskName"]
        file_path = "./tasks/" + taskName + ".json"
        file = open(file_path, "r")
        return jsonify(json.load(file))


@app.route("/task_rel", methods=["POST", "GET"])
def task_rel():
    data = request.get_json(force=True)
    tasks = []
    trel_inst = TaskReliability()
    final_return_data = []
    for d in data:
        print(d)
        if type(d) is not bool:
            if len(d) != 0:
                shipname = d["shipName"]
                taskName = d["taskName"]
                missionDataDuration = d["data"]
                cal_rel = d["cal_rel"]
                missionName = "A"
                rel = trel_inst.task_new_rel(
                    taskName, missionName, missionDataDuration, APP_ROOT, shipname
                )
                # print(rel)
                final_return_data.append(
                    {
                        "shipName": shipname,
                        "taskName": taskName,
                        "rel": rel["task_rel"],
                        "data": rel["all_missionRel"],
                        "cal_rel": cal_rel,
                    }
                )
    # name = data["taskName"][0]["name"]

    # missionDataDuration = data["missionProfileData"
    return jsonify(final_return_data)


@app.route("/task_dash_populate", methods=["POST", "GET"])
def task_dash_populate():
    trel_inst = TaskReliability()
    data = trel_inst.get_task_dropdown_data(APP_ROOT)
    return jsonify(data)


@app.route("/addUserSelectionData", methods=["POST", "GET"])
def addUserSelectionData():
    data = request.get_json(force=True)
    response = add_user_selection_data(data)
    return response


@app.route("/fetch_condition_monitoring", methods=["POST"])
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
@app.route("/save_assembly_rcm", methods=["POST"])
def save_assembly_rcm():
    data = request.get_json(force=True)
    rcm = RCMDB()
    res = rcm.save_asm(data)
    return res


@app.route("/fetch_assembly_rcm", methods=["POST"])
def fetch_assembly_rcm():
    data = request.get_json(force=True)
    sys_inst = System_Configuration_N()
    component_id = sys_inst.fetch_component_id(
        data["ship_name"], data["nomenclature"])
    res = sys_inst.fetch_system(data, component_id)
    rcm = RCMDB()
    res_r = rcm.fetch_saved_asm(data)
    res["asm"] = res_r
    return res


@app.route("/save_rcm", methods=["POST"])
def save_rcm():
    # data = request.get_json(force=True)
    # sys_inst = System_Configuration_N()
    # res = sys_inst.fetch_system(data)
    data = request.get_json(force=True)
    rcm = RCMDB()
    res_r = rcm.save_component_rcm(data)
    return res_r


@app.route("/rcm_report", methods=["POST", "GET"])
def rcm_report():
    # data = request.get_json(force=True)
    # sys_inst = System_Configuration_N()
    # res = sys_inst.fetch_system(data)
    data = request.get_json(force=True)
    system = data["nomenclature"]
    ship_name = data["ship_name"]
    rcm = RCMDB()
    res_r = rcm.generate_rcm_report(APP_ROOT, system, ship_name)
    target = os.path.join(
        APP_ROOT,
        "netra\public\{0}-{1}.pdf".format(
            ship_name.replace(" ", ""), system.replace(" ", "")
        ),
    )
    return jsonify({"res": res_r, "system": system, "ship_name": ship_name})


@app.route("/upload", methods=["POST", "GET"])
def fileUpload():
    if request.method == "POST":
        file = request.files.getlist("file")
        ss = request.form.get("system")
        pl = request.form.get("name")
        target_folder = os.path.join(
            APP_ROOT,
            "netra\public\{0}_{1}".format(
                pl.replace(" ", ""), ss.replace(" ", "")),
        )
        if not os.path.exists(target_folder):
            os.mkdir(target_folder)
        for f in file:
            filename = secure_filename(f.filename)
            f.save(os.path.join(target_folder, filename))
        return jsonify({"name": filename, "status": "success"})
    else:
        return jsonify({"status": "failed"})


@app.route("/fetch_system_files", methods=["POST", "GET"])
def fetch_system_files():
    if request.method == "POST":
        data = request.get_json(force=True)
        ss = data["system"]
        pl = data["ship_name"]
        target_folder = os.path.join(
            APP_ROOT,
            "netra\public\{0}_{1}".format(
                pl.replace(" ", ""), ss.replace(" ", "")),
        )
        files = os.listdir(target_folder)
        return jsonify({"files": files})
    else:
        return jsonify({"status": "failed"})


@app.route("/optimize", methods=["POST"])
def optimize():
    if request.method == "POST":
        data = request.json
        print(data)
        return optimizer()


# @app.route('/rul', methods=['POST'])
# def rul():
#     if request.method== 'POST':
#         file_path = os.path.join(app.config['UPLOAD_FOLDER'], 'uploaded_data.csv')
#         return rul_code(file_path)


@app.route("/rul", methods=["POST"])
def rul():
    if request.method == "POST":
        req_data = request.get_json()
        parameter = req_data["parameter"]
        equipment_id = req_data["equipmentId"]
        inst = RUL_dB()
        return inst.rul_code(equipment_id, parameter)


@app.route("/rul_equipment", methods=["POST"])
def rul_equipment():
    if request.method == "POST":
        inst = RUL_dB()
        return inst.rul_equipment_level()


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


# @app.route('/csv_upload', methods=['POST'])
# def predict_rul():
#     if 'file' in request.files:
#         file = request.files['file']
#         # Assuming the uploaded file is a CSV file
#         # You can modify the file processing based on your file format
#         file_path = os.path.join(app.config['UPLOAD_FOLDER'], 'uploaded_data.csv')
#         file.save(file_path)

#         return "file saved"

#     else:
#         # If the file is not provided, load the previously saved CSV file
#         return "file is not provided"


@app.route("/cgraph", methods=["POST"])
def cgraph():
    data = request.get_json()
    equipment_ids = data.get("equipment_id")
    graph = GraphDashBoard()
    return graph.graph_c(equipment_ids)


@app.route("/get_pf", methods=["POST"])
def pf():
    data = request.get_json()
    # equipment_id = data.get('equipment_id')
    name = data.get("name")
    equipment_id = data.get("equipment_id")
    rul_class = RUL_dB()
    return rul_class.fetch_PF(name, equipment_id)


@app.route("/get_credentials", methods=["POST"])
def get_credentials():
    data = request.json  # Assuming you send a JSON object in the request body
    if "username" in data and "password" in data:
        username = data["username"]
        password = data["password"]
        inst = Authentication()
        return inst.sign_in(username, password)


@app.route("/insert_user", methods=["POST"])
def insert_new_user():
    data = request.json  # Assuming you send a JSON object in the request body
    if "username" in data and "password" in data and "level" in data:
        username = data["username"]
        password = data["password"]
        level = data["level"]
        inst = Authentication()
        return inst.sign_up(username, password, level)


@app.route("/fetch_eta_beta", methods=["POST"])
def fetch_eta_beta():
    data = request.json
    component_id = data["component_id"]
    inst = Data_Manager()
    return inst.fetch_eeta_beta(component_id)


@app.route("/phase_json", methods=["POST"])
def phasejson():
    data = request.json
    phases = data["phases"]
    curr_task = data["task_name"]
    inst = TaskReliability()
    return inst.json_paraser(APP_ROOT, phases, curr_task)


@app.route("/get_ship_alpha_beta", methods=["POST"])
def fetch_equipment_alpha_betas():
    data = request.json
    ship_name = data["ship_name"]
    components = data["equipments"]
    inst = Data_Manager()
    return inst.fetch_alpha_beta(components=components)


@app.route("/update_alpha_beta", methods=["POST"])
def update_alpha_beta():
    data = request.json
    ship_name = data["ship_name"]
    component_name = data["equipment_name"]
    alpha = data["alpha"]
    beta = data["beta"]
    inst = Data_Manager()
    return inst.update_alpha_beta(
        ship_name=ship_name, component_name=component_name, alpha=alpha, beta=beta
    )


@app.route("/component_overhaul_age", methods=["POST"])
def set_component_overhaul_age():
    data = request.json
    age = data["age"]
    ship_name = data["ship_name"]
    component_name = data["equipment_name"]
    inst = Data_Manager()
    return inst.set_component_overhaul_age(ship_name, component_name, age)


@app.route('/pdf/<path:filename>', methods=["GET"])
def download_pdf(filename):
    print(filename)
    return send_from_directory('static/pdf', filename, as_attachment=True, mimetype='application/pdf')


@app.route('/get_overhaul_hours', methods=["POST"])
def get_overhaul_hours():
    data = request.json
    inst = Data_Manager()
    return inst.get_component_overhaul_hours(data)


@app.route('/reset_password', methods=["POST"])
def reset_password():
    data = request.json
    username = data["username"]
    inst = EmailSender(mail)
    return inst.send_notification_email(username, logo_data)


@app.route('/get_users', methods=['POST'])
def get_users():
    data = request.json
    inst = DashBoard()
    return inst.fetch_users(data)


@app.route('/update_user', methods=['PUT'])
def update_user_endpoint():
    data = request.json
    inst = DashBoard()
    return inst.update_user(data)


@app.route('/delete_user', methods=['POST'])
def delete_user():
    data = request.json
    inst = DashBoard()
    return inst.delete_user(data)


@app.route('/card_counts', methods=['GET'])
def card_counts():
    inst = DashBoard()
    return inst.card_counts()


@app.route('/srcetl', methods=['GET'])
def srcetl():
    inst = ETL()
    value = inst.operational_data_etl()
    val = inst.overhaul_data_etl()
    return jsonify({
        "code": 1,
        "message": "ETL processes completed successfully"
    })


@app.route('/set_equip_etl', methods=['POST'])
def set_equip_etl():
    data = request.json
    print(data)

    inst = ETL()
    inst.set_for_etl(data)

    # Assuming set_for_etl does not return anything, you can respond with a success message
    return jsonify({'message': 'ETL flag set successfully'})


@app.route('/unregister_equipment', methods=['POST'])
def unregister_equipment():
    data = request.get_json(force=True)
    inst = Data_Administrator()
    return inst.delete_data_for_component(data)


@app.route('/sysmetl', methods=['POST'])
def sysmetl():
    data = request.get_json(force=True)
    inst = Data_Administrator()
    return inst.register_equipment(data)


@app.route('/equipment_onship', methods=['POST'])
def equipment_onship():
    data = request.get_json(force=True)
    inst = Data_Administrator()
    return inst.get_equipments_onship(data)


@app.route('/delspecific', methods=['POST'])
def delspecific():
    try:
        data = request.get_json(force=True)
        print(data)
        inst = Data_Administrator()
        result = inst.del_specific_data(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/getspecific_data', methods=['POST'])
def getspecific_data():
    data = request.get_json(force=True)
    print(data)
    inst = Data_Administrator()
    return inst.specific_data(data)


@app.route("/upload_oem_data", methods=["POST"])
def oem_data():
    data = request.json["data"]
    inst = OEMData()
    inst.upload_data(data=data)
    return jsonify({
        "messege": "JSON DATA"
    })


@app.route('/del_task', methods=['POST'])
def delete_file():
    # Get the filename from the request
    filename = request.json.get('filename')

    if not filename:
        return jsonify({'error': 'Filename not provided'}), 400

    try:
        # Get the directory of the current file
        current_dir = os.path.dirname(os.path.abspath(__file__))

        # Construct the path to the folder
        folder_path = './tasks'

        # Construct the full path to the file
        file_path = os.path.join(folder_path, filename)

        # Check if the file exists
        if os.path.exists(file_path):
            # Delete the file
            os.remove(file_path)
            return jsonify({'message': f'File {filename} deleted successfully'}), 200
        else:
            return jsonify({'error': f'File {filename} does not exist'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route("/fetch_cmms_selection", methods=["GET"])
def fetch_cmms_selection():
    custom = Custom_Settings()
    data = custom.fetch_cmms_selection()
    return data


if __name__ == "__main__":
    app.secret_key = os.urandom(32)
    app.wsgi_app = middleware.TaskMiddleWare(app.wsgi_app, APP_ROOT)
    scheduler.start()
    app.run(debug=False)
