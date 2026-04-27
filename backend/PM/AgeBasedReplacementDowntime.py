
import scipy.integrate as integrate
from scipy.optimize import minimize
import math

beta = float(input("Enter beta value: "))
eeta = float(input("Enter eeta value: "))
df = float(input("Enter downtime of unplanned failure: "))
dp = float(input("Enter downtime of preventive replacement: "))


def reliability(t):
    return (math.e ** (-(t / eeta) ** beta))


def reliability_integral(t):
    result, error = integrate.quad(reliability, 0, t)
    return result


def objective(t):
    return ((df * (1 - reliability(t)) + dp * reliability(t)) / reliability_integral(t))


t_initial = 1
bounds = [(1, 10*eeta)]

# Minimize the objective function
result = minimize(objective, t_initial, bounds = bounds)

# Print the optimized result
print("Optimized solution:")
print("t =", result.x[0])
print("Objective value =", result.fun)

