from flask import request
import math
import scipy.integrate as integrate
from scipy.optimize import minimize
from scipy.stats import weibull_min
import numpy as np
import sympy as sp
from flask import jsonify
def optimizer():
    data = request.json
    method = data.get('method')

    if method == 'age_based':
        beta = float(data.get('beta'))
        eeta = float(data.get('eeta'))
        cf = float(data.get('cf'))
        cp = float(data.get('cp'))

        def reliability(t):
            return math.e ** (-(t / eeta) ** beta)

        def reliability_integral(t):
            result, error = integrate.quad(reliability, 0, t)
            return result

        def objective(t):
            return (cf * (1 - reliability(t)) + cp * reliability(t)) / reliability_integral(t)

        t_initial = 1
        bounds = [(1, 10 * eeta)]

        # Minimize the objective function
        result = minimize(objective, t_initial, bounds=bounds)

        # Return the optimized solution
        return jsonify({
            't': result.x[0],
            'objective_value': result.fun
        })

    elif method == 'downtime_based':
        beta = float(data.get('beta'))
        eeta = float(data.get('eeta'))
        df = float(data.get('df'))
        dp = float(data.get('dp'))

        def reliability(t):
            return math.e ** (-(t / eeta) ** beta)

        def reliability_integral(t):
            result, error = integrate.quad(reliability, 0, t)
            return result

        def objective(t):
            return (df * (1 - reliability(t)) + dp * reliability(t)) / reliability_integral(t)

        t_initial = 1
        bounds = [(1, 10 * eeta)]

        # Minimize the objective function
        result = minimize(objective, t_initial, bounds=bounds)

        # Return the optimized solution
        return jsonify({
            't': result.x[0],
            'objective_value': result.fun
        })

    elif method == 'component_group':
        n = int(data.get('n'))
        pmdt = float(data.get('pmdt'))
        cpm = float(data.get('cpm'))
        cf = float(data.get('cf'))

        class Component:
            def __init__(self, eeta, beta, c, rt):
                self.beta = beta
                self.eeta = eeta
                self.c = c
                self.rt = rt

            def reliability(self, t):
                return math.e ** (-(t / self.eeta) ** self.beta)

            def failure(self, t):
                return 1 - (math.e ** (-(t / self.eeta) ** self.beta))

            def weibull_pdf(self, t):
                return (self.beta / self.eeta) * ((t / self.eeta) ** (self.beta - 1)) * self.reliability(t)

            def integral(self, t):
                result, error = integrate.quad(lambda x: (self.failure(t - x) / (1 - (0.5 * self.failure(t - x)))) * self.weibull_pdf(t), 0, t)
                return result

            def expected_value(self):
                weibull_dist = weibull_min(self.beta, scale=self.eeta)
                return weibull_dist.expect(lambda x: x)

        component_list = []
        for i in range(n):
            eeta = float(data.get(f'component_{i+1}_eeta'))
            beta = float(data.get(f'component_{i+1}_beta'))
            c = float(data.get(f'component_{i+1}_c'))
            rt = float(data.get(f'component_{i+1}_rt'))
            component = Component(eeta, beta, c, rt)
            component_list.append(component)

        def objective(t):
            return ((pmdt * cpm) + sum(i.c for i in component_list) + sum(((i.failure(t) + i.integral(t)) * (i.c + (i.rt * cf))) for i in component_list)) / t

        t_initial = 1
        bounds = [(1, max(i.expected_value() for i in component_list))]

        # Minimize the objective function
        result = minimize(objective, t_initial, bounds=bounds)

        # Return the optimized solution
        return jsonify({
            't': result.x[0],
            'objective_value': result.fun
        })

    elif method == 'downtime_component_group':
        n = int(data.get('n'))
        pmdt = float(data.get('pmdt'))

        class Component:
            def __init__(self, eeta, beta, rt):
                self.beta = beta
                self.eeta = eeta
                self.rt = rt

            def reliability(self, t):
                return math.e ** (-(t / self.eeta) ** self.beta)

            def failure(self, t):
                return 1 - (math.e ** (-(t / self.eeta) ** self.beta))

            def weibull_pdf(self, t):
                return (self.beta / self.eeta) * ((t / self.eeta) ** (self.beta - 1)) * self.reliability(t)

            def integral(self, t):
                result, error = integrate.quad(lambda x: (self.failure(t - x) / (1 - (0.5 * self.failure(t - x)))) * self.weibull_pdf(t), 0, t)
                return result

            def expected_value(self):
                weibull_dist = weibull_min(self.beta, scale=self.eeta)
                return weibull_dist.expect(lambda x: x)

        component_list = []
        for i in range(n):
            eeta = float(data.get(f'component_{i+1}_eeta'))
            beta = float(data.get(f'component_{i+1}_beta'))
            rt = float(data.get(f'component_{i+1}_rt'))
            component = Component(eeta, beta, rt)
            component_list.append(component)

        def objective(t):
            return (pmdt + sum(((i.failure(t) + i.integral(t)) * i.rt) for i in component_list)) / t

        t_initial = 1
        bounds = [(1, 10000)]

        # Minimize the objective function
        result = minimize(objective, t_initial, bounds=bounds)

        # Return the optimized solution
        return jsonify({
            't': result.x[0],
            'objective_value': result.fun
        })
    
    elif method == 'calendar_time':
        beta = float(data.get('beta'))
        eeta = float(data.get('eeta'))
        cf = float(data.get('cf'))
        cp = float(data.get('cp'))

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
        return jsonify({
            't': result.x[0],
            'objective_value': result.fun
        })


    elif method == 'risk_target':
        beta = float(data.get('beta'))
        eeta = float(data.get('eeta'))
        p = float(data.get('p'))
        t = sp.Symbol('t')
        equation = sp.Eq(1 - sp.exp(-((t / eeta) ** beta)) - p, 0)
        solutions = sp.nsolve(equation, t, 1.0, solver='mnewton')

        print(solutions)

        return jsonify({
            't': float(solutions)
        })


    elif method == 'calender_downtime':
        beta = float(data.get('beta'))
        eeta = float(data.get('eeta'))
        df = float(data.get('df'))
        dp = float(data.get('dp'))

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
            return ( (dp + (df * (failure(t) + integral(t)))) / t)

        t_initial = 1
        bounds = [(1, expected_value)]

        # Minimize the objective function
        result = minimize(objective, t_initial, bounds = bounds)
        return jsonify({
            't': result.x[0],
            'objective_value': result.fun
        })


    else:
        return jsonify({
            'error': 'Invalid method provided'
        })
