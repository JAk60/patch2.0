from flask import Blueprint, request, jsonify

from backend.Reliability.reliability import Reliability
from backend.Mission_reliability_dashboard.mission_profile import MissionProfile
from backend.Mission_reliability_dashboard.taskReliability import TaskReliability
from backend.View_update.user_selection.user_selection import Custom_Settings

import os

APP_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

reliability_bp = Blueprint('reliability', __name__, url_prefix='/api')


@reliability_bp.route('/rel_dashboard', methods=['GET'])
def rel_dashboard():
    custom = Custom_Settings()
    mission = MissionProfile()
    return jsonify({
        'mission_data': mission.select_mission(toJson=False),
        'user_selection': custom.fetch_user_selection(toJson=False),
    })


@reliability_bp.route('/rel_estimate_EQ', methods=['POST'])
def rel_estimate_eq():
    data = request.get_json(force=True)['data']
    inst = Reliability()
    res = inst.mission_wise_rel_systemEQ(
        data['missions'], data['equipments'], data['nomenclature'], data['tempMissions']
    )
    return jsonify(res)






