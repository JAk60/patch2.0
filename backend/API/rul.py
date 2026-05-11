from flask import Blueprint, request, jsonify

from backend.modules.RUL.rul import RUL_dB
from backend.dB.hep.hep_dB import Hep_dB

rul_bp = Blueprint('rul', __name__, url_prefix='/api')


@rul_bp.route('/rul', methods=['POST'])
def rul():
    data = request.get_json()
    inst = RUL_dB()
    return inst.rul_code(data['equipmentId'], data['parameter'])


@rul_bp.route('/rul_equipment', methods=['POST'])
def rul_equipment():
    inst = RUL_dB()
    return inst.rul_equipment_level()


@rul_bp.route('/get_pf', methods=['POST'])
def get_pf():
    data = request.get_json()
    inst = RUL_dB()
    return inst.fetch_PF(data.get('name'), data.get('equipment_id'))


@rul_bp.route('/fetch_sensors', methods=['POST'])
def fetch_sensors():
    data = request.get_json()
    inst = RUL_dB()
    return inst.fetch_specific_sensors(data)


@rul_bp.route('/save_hep', methods=['POST'])
def save_hep():
    data = request.get_json(force=True)
    inst = Hep_dB()
    res = inst.save_dataToDB(data['flatData'], data['dtype'])
    return jsonify(res)
