import sympy as sp
import numpy as np
from sympy.utilities.lambdify import lambdify
from scipy.optimize import fsolve
bot = "JOJO"


class Mle:
    def twoParamWeibullEstimationForNRSEqSolvingReal(self, FailureData, noOfDataPoints):
        eta, beta = sp.symbols('eta beta', real=True, positive=True)
        etaArray = []
        betaArray = []

        meanToF = np.mean(FailureData)
        tryEta = meanToF
        for i in range(0, 4):
            tryBeta = 1
            for j in range(0, 6):
                f = lambdify(((eta, beta),), self.twoParamWeibullEstimationForNRSEqForming((FailureData, noOfDataPoints)),
                             modules="numpy")
                Eta_init = tryEta * (0.45 + i * 0.45)
                Beta_init = tryBeta + j * 0.5
                p = fsolve(f, (Eta_init, Beta_init))
                etaArray.append(round(float(p[0]), 2))
                betaArray.append(round(float(p[1]), 2))
            modeEtaCount = 0
            lessThanModeEtaCount = 0
            moreThanModeEtaCount = 0
            totalEtaCount = 0

            etaArray.sort(key=None, reverse=False)
            count = 1
            finalCount = 0
            for i in range(1, len(etaArray)):
                if (etaArray[i] == etaArray[i - 1]):
                    count += 1
                    value = etaArray[i]
                elif (etaArray[i] > etaArray[i - 1]):
                    count = 1
                    value = etaArray[i]
                if (count > finalCount):
                    finalCount = count
                    modeEta = value

                    #     meanEta = stats.tmean(etaArray)

            c = 0
            for c in range(0, len(etaArray)):
                if (round(etaArray[c], 2) == modeEta):
                    modeEtaCount += 1
                elif (round(etaArray[c], 2) < modeEta):
                    lessThanModeEtaCount += 1
                elif (round(etaArray[c], 2) > modeEta):
                    moreThanModeEtaCount += 1
                else:
                    print("Something's wrong!")
                totalEtaCount += 1

                #     print(modeEtaCount)
                #     print(lessThanModeEtaCount)
                #     print(moreThanModeEtaCount)
            print("%s: Estimated Eta is %s." % (bot, modeEta))
            #     print(round(meanEta,2))

            modeBetaCount = 0
            lessThanModeBetaCount = 0
            moreThanModeBetaCount = 0
            totalBetaCount = 0

            betaArray.sort(key=None, reverse=False)
            count = 1
            finalCount = 0
            for i in range(1, len(betaArray)):
                if (betaArray[i] == betaArray[i - 1]):
                    count += 1
                    value = betaArray[i]
                elif (betaArray[i] > betaArray[i - 1]):
                    count = 1
                    value = betaArray[i]
                if (count > finalCount):
                    finalCount = count
                    modeBeta = value

                    #     meanBeta = stats.tmean(betaArray)

            d = 0
            for d in range(0, len(betaArray)):
                if (round(betaArray[d], 2) == round(float(modeBeta), 2)):
                    modeBetaCount += 1
                elif (round(betaArray[d], 2) < round(float(modeBeta), 2)):
                    lessThanModeBetaCount += 1
                elif (round(betaArray[d], 2) > round(float(modeBeta), 2)):
                    moreThanModeBetaCount += 1
                else:
                    print("Something's wrong!")
                totalBetaCount += 1

                #     print(modeBetaCount)
                #     print(lessThanModeBetaCount)
                #     print(moreThanModeBetaCount)
            print("%s: Estimated beta is %s." % (bot, modeBeta))
            #     print(round(meanBeta,2))

            finalParam = [modeEta, modeBeta]

            age = 1000

            finalParam.append(age)
            return finalParam

    def twoParamWeibullEstimationForNRSEqForming(self, p):
        #     p[0]=FailureData,
        #     p[1]=noOfDataPoints
        print(
            "%s: Executing two parameter Weibull estimation for Non-Repairable systems with numPy for %s data points..." % (
                bot, p[1]))
        eta, beta, x = sp.symbols('eta beta x', real=True, positive=True)
        y = (beta / eta) * ((x / eta) ** (beta - 1)) * \
            (sp.exp(-((x / eta) ** beta)))

        # print("%s: Forming MLE function..." % bot)
        n = 1
        #     for i in range(0,len(FailureData)):
        for i in range(0, p[1]):
            l = y.subs({x: p[0][i]})
            n = n * l

        # print("%s: Taking natural log..." % bot)
        m = sp.expand_log(sp.log(n))
        #     print(m)
        # print("%s: Differentiating..." % bot)

        m1 = sp.sympify(sp.diff(m, eta))
        #     print(m1)
        m2 = sp.sympify(sp.diff(m, beta))
        #     print(m2)
        print("%s: Solving..." % bot)
        return (m1, m2)


# failure_dpoints = [93.15, 43.07, 102.82, 92.03, 28.90, 37.18, 32.05, 73.69,
#                    102.58, 56.10, 75.84, 18.08, 109.47, 56.23, 47.53]
# total_failure_points = len(failure_dpoints)
# mle_inst = Mle()
# return_data = mle_inst.twoParamWeibullEstimationForNRSEqSolvingReal(
#     failure_dpoints, total_failure_points)
# print(return_data)


# from reliability.Fitters import Fit_Weibull_2P
# import matplotlib.pyplot as plt
# TTF = [93.15, 43.07, 102.82, 92.03, 28.90, 37.18, 32.05, 73.69, 102.58, 56.10, 75.84, 18.08, 109.47, 56.23, 47.53]
# wb = Fit_Weibull_2P(failures=TTF)
