import numpy as np
import scipy.integrate as integrate
from scipy.optimize import minimize
from scipy.stats import weibull_min
# import matplotlib.pyplot as plt
import math

beta = float(input("Enter beta value: "))
eeta = float(input("Enter eeta value: "))
cf = float(input("Enter cost of unplanned failure: "))
cp = float(input("Enter cost of preventive replacement: "))

weibull_dist = weibull_min(beta, scale=eeta)
def func(x):
    return x
expected_value = weibull_dist.expect(func)


def reliability(t):
    return (math.e ** (-(t / eeta) ** beta))

def failure(t):
    return (1 - (math.e ** (-(t / eeta) ** beta)))

def weibullpdf(t):
    return ( (beta/eeta) * ((t / eeta) ** (beta - 1)) * reliability(t))

def integral(t):
    result, error = integrate.quad(lambda x: ((failure(t-x))* weibullpdf(x) / (1 - (0.5 * (failure(t-x))))) , 0, t)
    return result

def objective(t):
    return ( (cp + (cf * (failure(t) + integral(t)))) / t)

t_initial = 1
bounds = [(1, expected_value)]

# Minimize the objective function
result = minimize(objective, t_initial, bounds = bounds)

# Print the optimized result
print("Optimized solution:")
print("t =", result.x[0])
print("Objective value =", result.fun)


# # Create an array of t values
# t_values = np.linspace(1, expected_value, 50)

# # Calculate the objective function values for each t
# objective_values = [objective(t) for t in t_values]
# # Plot the graph

# plt.plot(t_values, objective_values)
# plt.xlabel('time')
# plt.ylabel('Objective Function')
# plt.title('time vs Objective Function')
# plt.grid(True)
# plt.show()