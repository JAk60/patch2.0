import os

from flask import Blueprint, request, jsonify, send_file, send_from_directory, current_app
from werkzeug.utils import secure_filename

from dB.Oem_Upload.oem import OEMData

APP_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

files_bp = Blueprint('files', __name__, url_prefix='/api')


def _ship_system_folder(ship_name: str, system: str) -> str:
    folder = '{0}_{1}'.format(ship_name.replace(' ', ''), system.replace(' ', ''))
    return os.path.join(APP_ROOT, 'frontend', 'public', folder)


@files_bp.route('/upload', methods=['POST'])
def file_upload():
    files = request.files.getlist('file')
    system = request.form.get('system', '')
    ship_name = request.form.get('name', '')

    target_folder = _ship_system_folder(ship_name, system)
    os.makedirs(target_folder, exist_ok=True)

    last_filename = ''
    for f in files:
        last_filename = secure_filename(f.filename)
        f.save(os.path.join(target_folder, last_filename))

    return jsonify({'name': last_filename, 'status': 'success'})


@files_bp.route('/fetch_system_files', methods=['POST'])
def fetch_system_files():
    data = request.get_json(force=True)
    target_folder = _ship_system_folder(data['ship_name'], data['system'])
    if not os.path.exists(target_folder):
        return jsonify({'files': []})
    return jsonify({'files': os.listdir(target_folder)})


@files_bp.route('/download/<ship_name>/<system>/<filename>', methods=['GET'])
def download_file(ship_name, system, filename):
    try:
        target_folder = _ship_system_folder(ship_name, system)
        return send_from_directory(target_folder, filename, as_attachment=True)
    except Exception as e:
        return jsonify({'status': 'failed', 'error': str(e)}), 404


@files_bp.route('/pdf/<path:filename>', methods=['GET'])
def download_pdf(filename):
    return send_from_directory('static/pdf', filename, as_attachment=True, mimetype='application/pdf')


@files_bp.route('/upload_oem_data', methods=['POST'])
def upload_oem_data():
    data = request.json.get('data')
    OEMData().upload_data(data=data)
    return jsonify({'message': 'OEM data uploaded successfully'})
