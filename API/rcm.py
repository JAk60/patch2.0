import os
import re

from flask import Blueprint, request, jsonify, send_file

from backend.sytem_configuration.system_configuration import System_Configuration_N
from backend.Maintenance_Allocation.RCM.PM.optimize import optimizer
from dB.RCM.rcmDB import RCMDB

APP_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

rcm_bp = Blueprint('rcm', __name__, url_prefix='/api')


@rcm_bp.route('/save_assembly_rcm', methods=['POST'])
def save_assembly_rcm():
    data = request.get_json(force=True)
    rcm = RCMDB()
    return rcm.save_asm(data)


@rcm_bp.route('/fetch_assembly_rcm', methods=['POST'])
def fetch_assembly_rcm():
    data = request.get_json(force=True)
    sys_inst = System_Configuration_N()
    component_id = sys_inst.fetch_component_id(data['ship_name'], data['nomenclature'])
    res = sys_inst.fetch_system(data, component_id)
    rcm = RCMDB()
    res['asm'] = rcm.fetch_saved_asm(data)
    return res


@rcm_bp.route('/save_rcm', methods=['POST'])
def save_rcm():
    data = request.get_json(force=True)
    rcm = RCMDB()
    return rcm.save_component_rcm(data)


@rcm_bp.route('/rcm_report', methods=['POST'])
def rcm_report():
    data = request.get_json(force=True)
    rcm = RCMDB()
    res = rcm.generate_rcm_report(APP_ROOT, data['nomenclature'], data['ship_name'])
    return jsonify({
        'res': res,
        'system': data['nomenclature'],
        'ship_name': data['ship_name'],
        'filename': res.get('filename', ''),
    })


@rcm_bp.route('/download_rcm_report/<filename>', methods=['GET'])
def download_rcm_report(filename):
    if not re.match(r'^[\w-]+-[\w-]+-\d+\.pdf$', filename):
        return jsonify({'error': 'Invalid filename'}), 400

    file_path = os.path.join(APP_ROOT, 'frontend', 'public', filename)
    if not os.path.isfile(file_path):
        return jsonify({'error': 'File not found'}), 404

    return send_file(file_path, mimetype='application/pdf', as_attachment=True, download_name=filename)


@rcm_bp.route('/optimize', methods=['POST'])
def optimize():
    return optimizer()
