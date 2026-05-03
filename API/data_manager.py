from flask import Blueprint, request, jsonify

from backend.View_update.data_manager.data_manager import Data_Manager

data_manager_bp = Blueprint('data_manager', __name__, url_prefix='/api')


@data_manager_bp.route('/save_data_manager', methods=['POST'])
def save_data_manager():
    data = request.get_json(force=True)
    inst = Data_Manager()
    res = inst.save_dataToDB(data['flatData'], data['dtype'])
    return jsonify(res)


@data_manager_bp.route('/update_parameters', methods=['POST'])
def update_parameters():
    data = request.get_json(force=True)
    inst = Data_Manager()
    return jsonify(inst.update_parameters(data))


@data_manager_bp.route('/save_historical_data', methods=['POST'])
def save_historical_data():
    data = request.get_json(force=True)
    if not data or 'data' not in data:
        return jsonify({'code': 0, 'message': 'Invalid data format'}), 400
    inst = Data_Manager()
    res = inst.insert_data(data['data'])
    return jsonify({'code': 1, 'message': 'Data Saved Successfully', 'result': res})


@data_manager_bp.route('/fetch_eta_beta', methods=['POST'])
def fetch_eta_beta():
    data = request.json
    inst = Data_Manager()
    return inst.fetch_eeta_beta(data['component_id'])


@data_manager_bp.route('/get_ship_alpha_beta', methods=['POST'])
def get_ship_alpha_beta():
    data = request.json
    inst = Data_Manager()
    return inst.fetch_alpha_beta(components=data['equipments'])


@data_manager_bp.route('/update_alpha_beta', methods=['POST'])
def update_alpha_beta():
    data = request.json
    inst = Data_Manager()
    return inst.update_alpha_beta(
        ship_name=data['ship_name'],
        component_name=data['equipment_name'],
        alpha=data['alpha'],
        beta=data['beta'],
    )


@data_manager_bp.route('/component_overhaul_age', methods=['POST'])
def set_component_overhaul_age():
    data = request.json
    inst = Data_Manager()
    return inst.set_component_overhaul_age(data['ship_name'], data['equipment_name'], data['age'])


@data_manager_bp.route('/get_overhaul_hours', methods=['POST'])
def get_overhaul_hours():
    data = request.json
    inst = Data_Manager()
    return inst.get_component_overhaul_hours(data)
