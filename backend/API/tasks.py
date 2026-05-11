import json
import os
from os import listdir
from os.path import isfile, join

from flask import Blueprint, request, jsonify

from backend.modules.Mission_reliability_dashboard.mission_profile import MissionProfile
from backend.modules.mission_configuration.mission_config import TaskService
from backend.modules.Mission_reliability_dashboard.taskReliability import TaskReliability

APP_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TASKS_DIR = os.path.join(APP_ROOT, 'tasks')

tasks_bp = Blueprint('tasks', __name__, url_prefix='/api')


@tasks_bp.route('/fetch_tasks', methods=['GET'])
def fetch_tasks():
    try:
        task_files = [f for f in listdir(TASKS_DIR) if isfile(join(TASKS_DIR, f))]
        tasks_info = []
        for filename in task_files:
            task_name = filename.split('.')[0]
            with open(join(TASKS_DIR, filename), 'r') as f:
                task_data = json.load(f)
            if isinstance(task_data, list) and task_data:
                tasks_info.append({
                    'taskname': task_name,
                    'ship_name': task_data[-1].get('shipName'),
                })
        return jsonify(tasks_info)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@tasks_bp.route('/save_task_configuration', methods=['POST'])
def save_task_configuration():
    try:
        data = request.get_json(force=True)
        result = TaskService().save_task_configuration(data)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({'error': str(e), 'code': 0}), 400
    except Exception as e:
        return jsonify({'error': str(e), 'code': 0}), 500


@tasks_bp.route('/load_task_configuration', methods=['POST'])
def load_task_configuration():
    data = request.get_json(force=True)
    file_path = os.path.join(TASKS_DIR, data['taskName'] + '.json')
    if not os.path.isfile(file_path):
        return jsonify({'error': 'Task not found'}), 404
    with open(file_path, 'r') as f:
        return jsonify(json.load(f))

@tasks_bp.route('/phase_json', methods=['POST'])
def phase_json():
    data = request.json
    inst = TaskReliability()
    try:
        result = inst.json_parser(APP_ROOT, data['phases'], data.get('task_name'), data.get('shipName'))
        return jsonify(result), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@tasks_bp.route('/task_rel', methods=['POST'])
def task_rel():
    data = request.get_json(force=True)
    inst = TaskReliability()
    final = []
    for d in data:
        if not isinstance(d, bool) and len(d) != 0:
            rel = inst.task_new_rel(
                d['taskName'], 'A', d['data'], APP_ROOT, d['shipName'],
                user_selected_names=d.get('selected_components', {})
            )
            final.append({
                'shipName': d['shipName'],
                'taskName': d['taskName'],
                'rel': rel['task_rel'],
                'data': rel['all_missionRel'],
                'cal_rel': d['cal_rel'],
            })
    return jsonify(final)


@tasks_bp.route('/mission_data', methods=['GET', 'POST'])
def mission_data():
    inst = MissionProfile()
    if request.method == 'POST':
        mission_data = request.get_json(force=True)['mission_data']
        return inst.insert_mission(mission_data)
    return inst.select_mission()

@tasks_bp.route('/task_dash_populate', methods=['GET', 'POST'])
def task_dash_populate():
    inst = TaskReliability()
    return jsonify(inst.get_task_dropdown_data(APP_ROOT))


@tasks_bp.route('/del_task', methods=['POST'])
def delete_task():
    filename = request.json.get('filename')
    if not filename:
        return jsonify({'error': 'Filename not provided'}), 400

    file_path = os.path.join(TASKS_DIR, filename)
    if not os.path.exists(file_path):
        return jsonify({'error': f'File {filename} does not exist'}), 404

    try:
        os.remove(file_path)
        return jsonify({'message': f'File {filename} deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
