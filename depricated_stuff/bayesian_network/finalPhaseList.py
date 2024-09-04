from sympy import *
from dB.dB_connection import cursor, cnxn
from sympy import Symbol
# import numpy as np
import pandas as pd
# from scipy import integrate
# from scipy.optimize import fsolve
# from mainHelp import MainHelp
from ML_train import Ml_train
from newMain import StageHelper


class FinalPhase:
    def final_phase_condition_monitoring(self, currAge=None, curr_temp_val=None,
                                         projected_durr=None, numOfPhases=4):
        ml_inst = Ml_train()
        stage_helper = StageHelper()
        sql_q = '''select hours, temp_c from condition_m_newT_Re'''
        df = pd.read_sql_query(sql_q, cnxn)
        threshold_sql = '''select Stage,threshold from condition_monitoring_stages where system=? and platform=? '''
        cursor.execute(threshold_sql, 'Re', 'newT')
        threshold_data = cursor.fetchall()
        para = ml_inst.estimation(df, threshold_data)
        # Trial
        beta1 = None
        eta1 = None
        beta2 = None
        eta2 = None
        eta3 = None
        beta3 = None
        eta4 = None
        beta4 = None
        if numOfPhases == 2:
            beta1 = para[0][0]
            eta1 = para[0][1]
            beta2 = para[1][0]
            eta2 = para[1][1]
        elif numOfPhases == 1:
            beta1 = para[0][0]
            eta1 = para[0][1]
        elif numOfPhases == 3:
            beta1 = para[0][0]
            eta1 = para[0][1]
            beta2 = para[1][0]
            eta2 = para[1][1]
            beta3 = para[2][0]
            eta3 = para[2][1]
        else:
            beta1 = para[0][0]
            eta1 = para[0][1]
            beta2 = para[1][0]
            eta2 = para[1][1]
            beta3 = para[2][0]
            eta3 = para[2][1]
            beta4 = para[3][0]
            eta4 = para[3][1]

        test_param = curr_temp_val
        mission_duration = projected_durr

        if numOfPhases == 2:
            if test_param < float(threshold_data[0][1]):
                R, paramsPhaseProb = stage_helper.rel(2, 1, eta1, eta2,
                                                      beta1, beta2, currAge, mission_duration)
                return R, paramsPhaseProb
            else:
                R, paramsPhaseProb = stage_helper.rel(
                    2, 2, eta2, beta2, currAge, mission_duration)
                return R, paramsPhaseProb
        elif numOfPhases == 1:
            R, paramsPhaseProb = stage_helper.rel(
                1, 1, eta1, beta1, currAge, mission_duration)
            return R, paramsPhaseProb
        elif numOfPhases == 3:
            if test_param < float(threshold_data[0][1]):
                R, paramsPhaseProb = stage_helper.rel(3, 1, eta1, eta2,
                                                      eta3, beta1, beta2, beta3, currAge, mission_duration)
                return R, paramsPhaseProb
            elif float(threshold_data[0][1]) < test_param < float(threshold_data[1][1]):
                R, paramsPhaseProb = stage_helper.rel(3, 2, eta2,
                                                      eta3, beta2, beta3, currAge, mission_duration)
                return R, paramsPhaseProb
            else:
                R, paramsPhaseProb = stage_helper.rel(
                    3, 3, eta3, beta3, currAge, mission_duration)
                return R, paramsPhaseProb
        elif numOfPhases == 4:
            if test_param < float(threshold_data[0][1]):
                R, paramsPhaseProb = stage_helper.rel(4, 1, eta1, eta2,
                                                      eta3, eta4, beta1, beta2, beta3, beta4, currAge, mission_duration)
                return R, paramsPhaseProb
            elif float(threshold_data[0][1]) < test_param < float(threshold_data[1][1]):
                R, paramsPhaseProb = stage_helper.rel(4, 2, eta2,
                                                      eta3, eta4, beta2, beta3, beta4, currAge, mission_duration)
                return R, paramsPhaseProb
            elif float(threshold_data[1][1]) < test_param < float(threshold_data[2][1]):
                R, paramsPhaseProb = stage_helper.rel(4, 3,
                                                      eta3, eta4, beta3, beta4, currAge, mission_duration)
                return R, paramsPhaseProb
            else:
                R, paramsPhaseProb = stage_helper.rel(
                    4, 4, eta4, beta4, currAge, mission_duration)
                return R, paramsPhaseProb
