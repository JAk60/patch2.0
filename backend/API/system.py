from flask import Blueprint, request, jsonify

from backend.modules.sytem_configuration.system_configuration import System_Configuration_N
from backend.modules.View_update.user_selection.user_selection import Custom_Settings
from backend.modules.View_update.add_new_ship.new_ship import add_user_selection_data
from backend.dB.phase_manager.phase_manager_dB import Phase_Manager_dB

system_bp = Blueprint('system', __name__, url_prefix='/api')


@system_bp.route('/save_system', methods=['POST'])
def save_system():
    data = request.get_json(force=True)
    inst = System_Configuration_N()
    res = inst.save_dataToDB(data['flatData'], data['dtype'])
    return jsonify(res)


@system_bp.route('/save_system_redundancy', methods=['POST'])
def save_system_redundancy():
    data = request.get_json(force=True)
    inst = System_Configuration_N()
    res = inst.save_dataToDB(data['flatData'], data['dtype'])
    return jsonify(res)


@system_bp.route('/fetch_system', methods=['POST'])
def fetch_system():
    data = request.get_json(force=True)
    conf_data = {
        'nomenclature': data['nomenclature'],
        'ship_name': data['ship_name'],
    }
    inst = System_Configuration_N()
    res = inst.fetch_system(conf_data, data['component_id'])

    if data.get('request_from') == 'phase':
        phase_inst = Phase_Manager_dB()
        phase_d = phase_inst.fetch_phases(data)
        res = {'system_data': res, 'phase_data': phase_d}

    return jsonify(res)


@system_bp.route('/fmodes', methods=['POST'])
def fetch_failure_modes():
    data = request.json
    component_id = data.get('component_id')
    inst = System_Configuration_N()
    res = inst.fmodesData(component_id)
    return jsonify(res)


@system_bp.route('/save_phase', methods=['POST'])
def save_phase():
    data = request.get_json(force=True)
    inst = Phase_Manager_dB()
    res = inst.save_dataToDB(data['flatData'], data['dtype'])
    return jsonify(res)


@system_bp.route('/fetch_user_selection', methods=['GET'])
def fetch_user_selection():
    inst = Custom_Settings()
    return inst.fetch_user_selection()


@system_bp.route('/addUserSelectionData', methods=['POST'])
def add_user_selection_data_route():
    data = request.get_json(force=True)
    return add_user_selection_data(data)
