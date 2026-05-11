import numpy as np
import scipy.integrate as integrate
from scipy.optimize import minimize
from scipy.stats import weibull_min
import matplotlib.pyplot as plt
import math

n = int(input("Enter no of components in group "))
pmdt = float(input("Enter preventive downtime for group: "))



class component():
    def __init__(self, eeta, beta,rt):
        self.beta = beta
        self.eeta = eeta
        self.rt = rt

    def reliability(self,t):
        return (math.e ** (-(t / self.eeta) ** self.beta))

    def failure(self, t):
        return (1 - (math.e ** (-(t / self.eeta) ** self.beta)))

    def weibullpdf(self, t):
        return ( (self.beta/self.eeta) * ((t / self.eeta) ** (self.beta - 1)) * self.reliability(t))

    def integral(self, t):
        result, error = integrate.quad(lambda x: (((self.failure(t-x)) / (1 - (0.5 * (self.failure(t-x))))) * self.weibullpdf(t)), 0, t)
        return result

    def expected_value(self):
        weibull_dist = weibull_min(self.beta, scale=self.eeta)
        def func(x):
            return x
        return(weibull_dist.expect(func))



component_list = []
for i in range(n):
    print(f"\nComponent {i+1}")
    eeta = float(input("Enter eeta value: "))
    beta = float(input("Enter beta value: "))
    rt = float(input("Enter replacement time of component: "))
    compon = component(eeta, beta, rt)
    component_list.append(compon)




def objective(t):
    return ( ( pmdt  + sum((( i.failure(t) + i.integral(t)) *  i.rt ) for i in component_list)) / t)


t_initial = 1
bounds = [(1, 10000)]
#
# Minimize the objective function
result = minimize(objective, t_initial, bounds = bounds)
#
# Print the optimized result
print("Optimized solution:")
print("t =", result.x[0])
print("Objective value =", result.fun)
#
# Create an array of t values
t_values = np.linspace(1, max(i.expected_value() for i in component_list), 100)

# Calculate the objective function values for each t
objective_values = [objective(t) for t in t_values]
print(objective_values)
# Plot the graph

plt.plot(t_values, objective_values)
plt.xlabel('time')
plt.ylabel('Objective Function')
plt.title('time vs Objective Function')
plt.grid(True)
plt.show()