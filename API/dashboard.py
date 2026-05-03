from flask import Blueprint, request, jsonify

from backend.Dashboard.DashBoard import DashBoard
from backend.View_update.CMMSTONETRA.data_adminstrator import Data_Administrator

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api')


@dashboard_bp.route('/card_counts', methods=['GET'])
def card_counts():
    return DashBoard().card_counts()


@dashboard_bp.route('/delspecific', methods=['POST'])
def delete_specific():
    try:
        data = request.get_json(force=True)
        result = Data_Administrator().del_specific_data(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@dashboard_bp.route('/getspecific_data', methods=['POST'])
def get_specific_data():
    data = request.get_json(force=True)
    return Data_Administrator().specific_data(data)
