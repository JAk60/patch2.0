from sympy import *
# from databaseRelated.newAutoTables import conn1, cursor
from sympy import Symbol
# import numpy as np
# import pandas as pd
from scipy import integrate
# from scipy.optimize import fsolve
# from mainHelp import  MainHelp
# from ML_train import Ml_train


class MainHelp:
    def __init__(self):
        self.eta1 = None
        self.eta2 = None
        self.eta3 = None
        self.eta4 = None
        self.beta1 = None
        self.beta2 = None
        self.beta3 = None
        self.beta4 = None
        self.T1 = None  # current age
        self.missionDuration = None

    # , d, T1, numOfPhases, *args
    # def stage1(self, num_of_phases):
    #     if num_of_phases == 4:
    #         return self.phase_four_helper_stage1()
    #     elif num_of_phases == 3:
    #         return self.phase_three_helper_stage1()
    #     elif num_of_phases == 2:
    #         return self.phase_two_helper_stage1()
    #     else:
    #         return self.phase_one_helper_stage1()

    # # , b1, eta1, T1, b2, eta2, b3, eta3, d

    # def stage2(self):  # rel_healthy
    #     c1 = self.phase1_cond_relia(
    #         self.missionDuration, self.T1, self.eta2, self.beta2)
    #     c2 = integrate.nquad(self.phase2function(), [
    #                          self.bound], args=(self.missionDuration,))[0]
    #     c3 = integrate.nquad(self.phase3function(), [
    #                          self.bounds_x, self.bounds_y], args=(self.missionDuration,))[0]
    #     relia = c1[0] + c2 + c3
    #     return relia, [c1[0], c2, c3]

    # # , eta2, T1, b2, eta3, b3, d
    # def stage3(self):
    #     c1 = self.phase1_cond_relia(
    #         self.missionDuration, self.T1, self.eta2, self.beta2)
    #     c2 = integrate.nquad(self.phase2function(), [
    #                          self.bound], args=(self.missionDuration,))[0]
    #     relia = c1[0] + c2
    #     return relia, [c1[0], c2]

    # def phase4function(self, *args):
    #     tou = args[0]
    #     phi = args[1]
    #     gama = args[2]
    #     return (self.beta1 * ((self.T1 + tou) / self.eta1) ** self.beta1) * exp((self.T1 / self.eta1) ** self.beta1) * exp(-((self.T1 + tou) / self.eta1) ** self.beta1) * (
    #         self.beta2 / self.eta2) * ((phi / self.eta2) ** (self.beta2 - 1)) * exp(-(phi / self.eta2) ** self.beta2) * (self.beta3 / self.eta3) * (
    #         (gama / self.eta3) ** (self.beta3 - 1)) * exp(-(gama / self.eta3) ** self.beta3) * exp(
    #         -((self.missionDuration - tou - phi - gama) / self.eta4) ** self.beta4) / (self.T1 + gama)

    # def phase3function(self, *args):
    #     tou = args[0]
    #     phi = args[1]
    #     return (self.beta1 * ((self.T1 + tou) / self.eta1) ** self.beta1) * exp((self.T1 / self.eta1) ** self.beta1) * exp(-((self.T1 + tou) / self.eta1) ** self.beta1) * (
    #         self.beta2 / self.eta2) * ((phi / self.eta2) ** (self.beta2 - 1)) * exp(-(phi / self.eta2) ** self.beta2) * exp(
    #         -((self.missionDuration - tou - phi) / self.eta3) ** self.beta3) / (self.T1 + tou)

    # def phase2function(self, *args):
    #     to = args[0]
    #     print(args[1])
    #     return self.beta1 * ((self.T1 + to) / self.eta1) ** self.beta1 * exp((self.T1 / self.eta1) ** self.beta1) * exp(-((self.T1 + to) / self.eta1) ** self.beta1) * exp(
    #         -((self.missionDuration - to) / self.eta2) ** self.beta2) / (self.T1 + to)

    # def phase1_cond_relia(self, t, t1, *args):
    #     # t = self.missionDuration
    #     # t1 = self.T1
    #     eta = args[0]
    #     beta = args[1]
    #     c1 = exp(-((t + t1) / eta) ** beta) / exp(-(t1 / eta) ** beta)
    #     return c1, [c1]

    # @staticmethod
    def bound1(*args):
        return [0, args[-1] - args[-2] - args[-3]]

    # @staticmethod
    def bound2(*args):
        return [0, args[-1] - args[-2]]

    # @staticmethod
    def bound3(*args):
        return [0, args[-1]]

    # @staticmethod
    def bounds_y(*args):
        return [0, args[-1]]

    # @staticmethod
    def bounds_x(*args):
        return [0, args[-1] - args[-2]]

    @staticmethod
    def bound(*args):
        return [0, args[-1]]

    # def phase_four_helper_stage1(self):
    #     c1 = self.phase1_cond_relia(
    #         self.missionDuration, self.T1, self.eta1, self.beta1)
    #     c2 = integrate.nquad(self.phase2function(), [
    #                          self.bound], args=(self.missionDuration, self.eta2, ))[0]
    #     c3 = integrate.nquad(self.phase3function(), [
    #                          self.bounds_x, self.bounds_y], args=(self.missionDuration,))[0]
    #     c4 = integrate.nquad(self.phase4function(), [
    #                          self.bound1, self.bound2, self.bound3], args=(self.missionDuration,))[0]
    #     relia = c1[0] + c2 + c3 + c4
    #     return relia, [c1[0], c2, c3, c4]

    # def phase_three_helper_stage1(self):
    #     c1 = self.phase1_cond_relia(
    #         self.missionDuration, self.T1, self.eta1, self.beta1)
    #     c2 = integrate.nquad(self.phase2function(), [
    #                          self.bound], args=(self.missionDuration,))[0]
    #     c3 = integrate.nquad(self.phase3function(), [
    #                          self.bounds_x, self.bounds_y], args=(self.missionDuration,))[0]
    #     relia = c1[0] + c2 + c3
    #     return relia, [c1[0], c2, c3]

    # def phase_two_helper_stage1(self):
    #     c1 = self.phase1_cond_relia(
    #         self.missionDuration, self.T1, self.eta1, self.beta1)
    #     c2 = integrate.nquad(self.phase2function(), [
    #                          self.bound], args=(self.missionDuration,))[0]
    #     relia = c1[0] + c2
    #     return relia, [c1[0], c2]

    # def phase_one_helper_stage1(self):
    #     c1 = self.phase1_cond_relia(
    #         self.missionDuration, self.T1, self.eta1, self.beta1)
    #     relia = c1[0]
    #     return relia, [c1[0]]

    def stage1_triple_integration(self, args):
        eta1 = args[0]
        eta2 = args[1]
        eta3 = args[2]
        eta4 = args[3]
        b1 = args[4]
        b2 = args[5]
        b3 = args[6]
        b4 = args[7]
        T1 = args[8]  # currAge
        d = args[9]  # mission duration

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
        c2 = integrate.nquad(integrand1, [self.bound], args=(d, ))[0]
        c3 = integrate.nquad(f, [self.bounds_x, self.bounds_y], args=(d, ))[0]
        c4 = integrate.nquad(
            f2, [self.bound1, self.bound2, self.bound3], args=(d,))[0]
        relia = c1[0] + c2 + c3 + c4
        return relia, [c1[0], c2, c3, c4]

    def stage2_double_integration(self, *args):
        eta1 = args[0]
        eta2 = args[1]
        eta3 = args[2]
        b1 = args[3]
        b2 = args[4]
        b3 = args[5]
        T1 = args[6]  # currAge
        d = args[7]  # mission duration

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
        relia = c1[0] + c2 + c3
        return relia, [c1[0], c2, c3]

    def stage3_single_integration(self, *args):
        eta1 = args[0]
        eta2 = args[1]
        b1 = args[3]
        b2 = args[4]
        T1 = args[5]  # currAge
        d = args[6]  # mission duration

        def integrand1(*args):
            to = args[0]
            return b1 * ((T1 + to) / eta1) ** b1 * exp((T1 / eta1) ** b1) * exp(-((T1 + to) / eta1) ** b1) * exp(
                -((d - to) / eta2) ** b2) / (T1 + to)

        c1 = self.cond_relia(eta1, b1, d, T1)
        c2 = integrate.nquad(integrand1, [self.bound], args=(d, eta2, b2))[0]
        relia = c1[0] + c2
        return relia, [c1[0], c2]

    def stage4_no_integration(self, *args):
        eta1 = args[0]
        b1 = args[4]
        T1 = args[8]  # currAge
        d = args[9]  # mission duration

        c1 = self.cond_relia(eta1, b1, d, T1)
        relia = c1[0]
        return relia, [c1[0]]

    def cond_relia(self, eta, beta, t, t1):
        c1 = exp(-((t + t1) / eta) ** beta) / exp(-(t1 / eta) ** beta)
        return c1, [c1]

    def reliabiility(self, eta, beta, t):
        return exp(-(t / eta) ** beta)
