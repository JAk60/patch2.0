from sympy import *
from databaseRelated.newAutoTables import conn1, cursor
from sympy import Symbol
import numpy as np
import pandas as pd
from scipy import integrate
from scipy.optimize import fsolve
from mainHelp import MainHelp
from ML_train import Ml_train
from newMain import StageHelper


class Condition_monitoring2:
    def condition_monitoring(self, currAge=None, curr_temp_val=None, projected_durr=None):
        ml_inst = Ml_train()
        helper = MainHelp()
        stage_helper = StageHelper()
        # Temp Data
        sql_q = '''select hours, temp_c from condition_m_newT_Re'''
        df = pd.read_sql_query(sql_q, conn1)
        threshold_sql = '''select Stage,threshold from condition_monitoring_stages where system=? and platform=? '''
        cursor.execute(threshold_sql, 'Re', 'newT')
        threshold_data = cursor.fetchall()
        para = ml_inst.estimation(df, threshold_data)
        beta1 = para[0][0]
        eta1 = para[0][1]
        beta2 = para[1][0]
        eta2 = para[1][1]
        beta3 = para[2][0]
        eta3 = para[2][1]
        beta4 = para[3][0]
        eta4 = para[3][1]
        # tt = helper.reliFresh(projected_durr, currAge, 4 ,eta1, beta1, eta2, beta2, eta3, beta3, eta4,
        #                   beta4)
        T_all = np.linspace(0, 14000, 20)
        act_t90 = []
        act_t10 = []

        R = 1
        m = 10

        cal90 = []
        cal10 = []

        # =================================================
        # Bhupendra
        # =================================================
        # Get last Record (Latest) wrt date. Right now I'm taking Random
        # latest_sql = """select TOP 1  * from condition_m_newT_Re where temp_c is NOT NULL order by NEWID()"""
        # cursor.execute(latest_sql)
        # latest_row = cursor.fetchone()
        # if latest_row:
        #     test_param = float(latest_row[4])
        #     age = latest_row[3]
        age = currAge
        test_param = curr_temp_val
        mission_duration = projected_durr
        stage_helper.rel(4, 1, eta1, eta2, eta3, eta4,
                         beta1, beta2, beta3, beta4, currAge, mission_duration)
        # for i in range(len(threshold_data)):
        #     threshold_val = float(threshold_data[i][1])
        #     param = para[i:]
        #     if i == 0:
        #         if test_param < threshold_val:
        #             R = self.reli_healthy(beta1,eta1,age,beta2, eta2, beta3, eta3, mission_duration)
        #             print('The Rel is ' + str(R))
        #             for temp_d in range(0,1000, 10):
        #                 res_life = self.reli_healthy(beta1,eta1,age,beta2, eta2, beta3, eta3, temp_d)
        #                 print(res_life)
        #             break
        #     else:
        #         if np.logical_and(test_param > float(threshold_data[i - 1][1]), test_param < threshold_val):
        #             R = self.reli_part_deto(eta2, age, beta2, eta3, beta3, mission_duration, mission_duration)
        #             print('The Rel is ' + str(R))
        #             for temp_d in range(0,1000, 10):
        #                 res_life = self.reli_part_deto(eta2, age, beta2, eta3, beta3, mission_duration, temp_d)
        #                 print(res_life)
        #             break
        # if len(threshold_data) > 0:
        #     if test_param >  float(threshold_data[len(threshold_data)-1][1]):
        #         param = para[-1]
        #         R = self.cond_relia(eta4, beta4, age, mission_duration)
        #         print('The rel is ' + str(R))
        #         print('This is detoriated!!')
        #         for temp_d in range(0, 1000, 10):
        #             res_life = self.cond_relia(eta3, beta3, age, temp_d)
        #             print(res_life)

        # This is just for temporary!

        if test_param < float(threshold_data[0][1]):
            R, paramsPhaseProb = self.reli_fresh(mission_duration, age, eta1, beta1, eta2, beta2, eta3, beta3, eta4,
                                                 beta4)

            return R, paramsPhaseProb
            # print('This is first phase, healthy one and the relibility is {}'.format(R))
        elif test_param > float(threshold_data[0][1]) and test_param < float(threshold_data[1][1]):
            R, paramsPhaseProb = self.reli_healthy(
                beta2, eta2, age, beta3, eta3, beta4, eta4, mission_duration)
            return R, paramsPhaseProb
            # print('This is healthy and the reliability is {}'.format(R))
        elif test_param > float(threshold_data[1][1]) and test_param < float(threshold_data[2][1]):
            R, paramsPhaseProb = self.reli_part_deto(
                eta3, age, beta3, eta4, beta4, mission_duration)
            return R, paramsPhaseProb
            # print('This is partially detoriated and the reliability is {}'.format(R))
        else:
            R, paramsPhaseProb = self.cond_relia(
                eta4, beta4, age, mission_duration)
            return R, paramsPhaseProb
            # print('The final detoriated reliability is {}'.format(R))

    def cond_relia(self, eta, beta, t, t1):
        c1 = exp(-((t + t1) / eta) ** beta) / exp(-(t1 / eta) ** beta)
        return c1, [c1]

    def reliabiility(self, eta, beta, t):
        return exp(-(t / eta) ** beta)

    def reli_part_deto(self, eta2, T1, b2, eta3, b3, d):
        def integrand2(*args):
            to = args[0]
            return b2 * ((T1 + to) / eta2) ** b2 * exp((T1 / eta2) ** b2) * exp(-((T1 + to) / eta2) ** b2) * exp(
                -((d - to) / eta3) ** b3) / (T1 + to)

        c1 = self.cond_relia(eta2, b2, d, T1)
        c2 = integrate.nquad(integrand2, [self.bound], args=(d,))[0]
        relia = c1[0] + c2
        return relia, [c1[0], c2]

    # def bounds_x(*args):
    #     return [0, args[-1] - args[-2]]
    #
    # def bound(*args):
    #     return [0, args[-1]]

    def bound1(*args):
        return [0, args[-1] - args[-2] - args[-3]]

    def bound2(*args):
        return [0, args[-1] - args[-2]]

    def bound3(*args):
        return [0, args[-1]]

    def bounds_y(*args):
        return [0, args[-1]]

    def bounds_x(*args):
        return [0, args[-1] - args[-2]]

    def bound(*args):
        return [0, args[-1]]

    # def reli_healthy(self,b1, eta1, T1, b2, eta2, b3, eta3, d):
    #     def integrand1(*args):
    #         to = args[0]
    #         return b1 * ((T1 + to) / eta1) ** b1 * exp((T1 / eta1) ** b1) * exp(-((T1 + to) / eta1) ** b1) * exp(
    #             -((d - to) / eta2) ** b2) / (T1 + to)
    #
    #     def f(*args):
    #         tou = args[0]
    #         phi = args[1]
    #         return (b1 * ((T1 + tou) / eta1) ** b1) * exp((T1 / eta1) ** b1) * exp(-((T1 + tou) / eta1) ** b1) * (
    #             b2 / eta2) * ((phi / eta2) ** (b2 - 1)) * exp(-(phi / eta2) ** b2) * exp(
    #             -((d - tou - phi) / eta3) ** b3) / (
    #                    T1 + tou)
    #
    #     relia = self.cond_relia(eta1, b1, d, T1)
    #     relia1 =  integrate.nquad(integrand1, [self.bound], args=(d,))[0]
    #     relia2 =  integrate.nquad(f, [self.bounds_x, self.bound], args=(d,))[0]
    #
    #     return relia1 + relia2 + relia
    def reli_healthy(self, b1, eta1, T1, b2, eta2, b3, eta3, d):
        def integrand1(*args):
            to = args[0]
            return b1 * ((T1 + to) / eta1) ** b1 * exp((T1 / eta1) ** b1) * exp(-((T1 + to) / eta1) ** b1) * exp(
                -((d - to) / eta2) ** b2) / (T1 + to)

        def f(*args):
            tou = args[0]
            phi = args[1]
            return (b1 * ((T1 + tou) / eta1) ** b1) * exp((T1 / eta1) ** b1) * exp(-((T1 + tou) / eta1) ** b1) * (
                b2 / eta2) * ((phi / eta2) ** (b2 - 1)) * exp(-(phi / eta2) ** b2) * exp(
                -((d - tou - phi) / eta3) ** b3) / (T1 + tou)

        c1 = self.cond_relia(eta1, b1, d, T1)
        c2 = integrate.nquad(integrand1, [self.bound], args=(d,))[0]
        c3 = integrate.nquad(f, [self.bounds_x, self.bounds_y], args=(d,))[0]
        relia = c1[0] + c2 + c3
        return relia, [c1[0], c2, c3]

    def reli_fresh(self, d, T1, eta1, b1, eta2, b2, eta3, b3, eta4, b4):

        def f2(*args):
            tou = args[0]
            phi = args[1]
            gama = args[2]
            return (b1 * ((T1 + tou) / eta1) ** b1) * exp((T1 / eta1) ** b1) * exp(-((T1 + tou) / eta1) ** b1) * (
                b2 / eta2) * ((phi / eta2) ** (b2 - 1)) * exp(-(phi / eta2) ** b2) * (b3 / eta3) * (
                (gama / eta3) ** (b3 - 1)) * exp(-(gama / eta3) ** b3) * exp(
                -((d - tou - phi - gama) / eta4) ** b4) / (T1 + gama)

        def integrand1(*args):
            to = args[0]
            return b1 * ((T1 + to) / eta1) ** b1 * exp((T1 / eta1) ** b1) * exp(-((T1 + to) / eta1) ** b1) * exp(
                -((d - to) / eta2) ** b2) / (T1 + to)

        def f(*args):
            tou = args[0]
            phi = args[1]
            return (b1 * ((T1 + tou) / eta1) ** b1) * exp((T1 / eta1) ** b1) * exp(-((T1 + tou) / eta1) ** b1) * (
                b2 / eta2) * ((phi / eta2) ** (b2 - 1)) * exp(-(phi / eta2) ** b2) * exp(
                -((d - tou - phi) / eta3) ** b3) / (T1 + tou)

        c1 = self.cond_relia(eta1, b1, d, T1)
        c2 = integrate.nquad(integrand1, [self.bound], args=(d, eta2, b2))[0]
        c3 = integrate.nquad(f, [self.bounds_x, self.bounds_y], args=(d, ))[0]
        c4 = integrate.nquad(
            f2, [self.bound1, self.bound2, self.bound3], args=(d,))[0]
        relia = c1[0] + c2 + c3 + c4
        # relia = self.cond_relia(eta1, b1, d, T1) + integrate.nquad(integrand1, [self.bound], args=(d,))[0] + \
        #         integrate.nquad(f, [self.bounds_x, self.bounds_y], args=(d,))[0] + \
        #         integrate.nquad(f2, [self.bound1, self.bound2, self.bound3], args=(d,))[0]

        return relia, [c1[0], c2, c3, c4]

    # def residual_life_calculation(self,rel, eta1, beta1, eta2, beta2, eta3, beta3, age, duration):
    #     t10 = Symbol('t10')
    #     rel = self.r
    #     return  np.log(2.73)

# inst = Condition_monitoring2()
# inst.condition_monitoring()
# print('This ends here')
