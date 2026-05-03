from flask import Blueprint, request, jsonify

from dB.ETL.sourceData import ETL
from backend.View_update.CMMSTONETRA.data_adminstrator import Data_Administrator

etl_bp = Blueprint('etl', __name__, url_prefix='/api')


@etl_bp.route('/srcetl', methods=['GET'])
def srcetl():
    inst = ETL()
    inst.operational_data_etl()
    inst.overhaul_data_etl()
    return jsonify({'code': 1, 'message': 'ETL processes completed successfully'})


@etl_bp.route('/set_equip_etl', methods=['POST'])
def set_equip_etl():
    data = request.json
    ETL().set_for_etl(data)
    return jsonify({'message': 'ETL flag set successfully'})


@etl_bp.route('/set_equip_ops', methods=['POST'])
def set_equip_ops():
    data = request.json
    ETL().set_for_ops(data)
    return jsonify({'message': 'Equipment status set successfully'})


@etl_bp.route('/sysmetl', methods=['POST'])
def sysmetl():
    data = request.get_json(force=True)
    inst = Data_Administrator()
    return inst.register_equipment(data)


@etl_bp.route('/unregister_equipment', methods=['POST'])
def unregister_equipment():
    data = request.get_json(force=True)
    inst = Data_Administrator()
    return inst.delete_data_for_component(data)


@etl_bp.route('/equipment_onship', methods=['POST'])
def equipment_onship():
    data = request.get_json(force=True)
    inst = Data_Administrator()
    return inst.get_equipments_onship(data)


@etl_bp.route('/all_equipments_onship', methods=['POST'])
def all_equipments_onship():
    data = request.get_json(force=True)
    inst = Data_Administrator()
    return inst.get_all_equipments_onship(data)
