from flask import Blueprint, request, jsonify

from backend.modules.condition_monitioring.condition_monitoring import conditionMonitoring_dB
from backend.modules.condition_monitioring.cgraph import GraphDashBoard
from backend.modules.View_update.user_selection.user_selection import Custom_Settings

cm_bp = Blueprint('condition_monitoring', __name__, url_prefix='/api')


@cm_bp.route('/cm_dashboard', methods=['GET'])
def cm_dashboard():
    custom = Custom_Settings()
    cm_inst = conditionMonitoring_dB()
    return jsonify({
        'parameters': cm_inst.fetch_all_params(),
        'user_selection': custom.fetch_user_selection(toJson=False),
    })


@cm_bp.route('/save_condition_monitoring', methods=['POST'])
def save_condition_monitoring():
    data = request.get_json(force=True)
    inst = conditionMonitoring_dB()
    res = inst.save_dataToDB(data['flatData'], data['dtype'])
    return res


@cm_bp.route('/fetch_condition_monitoring', methods=['POST'])
def fetch_condition_monitoring():
    data = request.get_json(force=True)
    try:
        inst = conditionMonitoring_dB()
        result = inst.fetch_data_for_display(data['system'], data['type'])
        return jsonify(result)
    except Exception as e:
        return jsonify({'message': str(e), 'code': 0}), 500


@cm_bp.route('/fetch_params', methods=['POST'])
def fetch_params():
    data = request.get_json(force=True)
    inst = conditionMonitoring_dB()
    res = inst.fetch_params(data['ComponentId'])
    return jsonify(res)


@cm_bp.route('/fetch_cmdata', methods=['POST'])
def fetch_cmdata():
    data = request.get_json(force=True)
    inst = conditionMonitoring_dB()
    res = inst.fetch_cmdata(data['EquipmentIds'], data['ParameterNames'])
    return jsonify(res)


@cm_bp.route('/cgraph', methods=['POST'])
def cgraph():
    data = request.get_json()
    graph = GraphDashBoard()
    return graph.graph_c(data.get('equipment_id'))


@cm_bp.route('/fetch_cmms_selection', methods=['GET'])
def fetch_cmms_selection():
    inst = Custom_Settings()
    return inst.fetch_cmms_selection()
