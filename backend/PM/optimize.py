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

        result = minimize(objective, t_initial, bounds=bounds)

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

        result = minimize(objective, t_initial, bounds=bounds)

        return jsonify({
            't': result.x[0],
            'objective_value': result.fun
        })

    elif method == 'component_group':
        # Check which parameters are missing
        required_params = {
            'n': data.get('n'),
            'pmdt': data.get('pmdt'),
            'cpm': data.get('cpm'),
            'cf': data.get('cf'),
            'eeta': data.get('eeta'),
            'beta': data.get('beta'),
            'c': data.get('c'),
            'rt': data.get('rt')
        }

        missing = [key for key, value in required_params.items()
                   if value is None]

        if missing:
            return jsonify({
                'error': f'Missing required parameters: {", ".join(missing)}',
                'required_parameters': ['n', 'pmdt', 'cpm', 'cf', 'eeta', 'beta', 'c', 'rt'],
                'received_parameters': list(data.keys())
            }), 400

        try:
            n = int(required_params['n'])
            pmdt = float(required_params['pmdt'])
            cpm = float(required_params['cpm'])
            cf = float(required_params['cf'])
            eeta = float(required_params['eeta'])
            beta = float(required_params['beta'])
            c = float(required_params['c'])
            rt = float(required_params['rt'])
        except (ValueError, TypeError) as e:
            return jsonify({
                'error': f'Invalid parameter value: {str(e)}',
                'required_parameters': ['n', 'pmdt', 'cpm', 'cf', 'eeta', 'beta', 'c', 'rt']
            }), 400

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
                result, error = integrate.quad(lambda x: (self.failure(
                    t - x) / (1 - (0.5 * self.failure(t - x)))) * self.weibull_pdf(t), 0, t)
                return result

            def expected_value(self):
                weibull_dist = weibull_min(self.beta, scale=self.eeta)
                return weibull_dist.expect(lambda x: x)

        # Create n identical components with the same parameters
        component_list = [Component(eeta, beta, c, rt) for _ in range(n)]

        def objective(t):
            return ((pmdt * cpm) + sum(i.c for i in component_list) + sum(((i.failure(t) + i.integral(t)) * (i.c + (i.rt * cf))) for i in component_list)) / t

        t_initial = 1
        bounds = [(1, component_list[0].expected_value())]

        result = minimize(objective, t_initial, bounds=bounds)

        return jsonify({
            't': result.x[0],
            'objective_value': result.fun
        })

    elif method == 'downtime_component_group':
        try:
            n = int(data.get('n'))
            pmdt = float(data.get('pmdt'))
            # Single component parameters
            eeta = float(data.get('eeta'))
            beta = float(data.get('beta'))
            rt = float(data.get('rt'))
        except (ValueError, TypeError) as e:
            return jsonify({
                'error': f'Invalid or missing parameters: {str(e)}',
                'required_parameters': ['n', 'pmdt', 'eeta', 'beta', 'rt']
            }), 400

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
                result, error = integrate.quad(lambda x: (self.failure(
                    t - x) / (1 - (0.5 * self.failure(t - x)))) * self.weibull_pdf(t), 0, t)
                return result

            def expected_value(self):
                weibull_dist = weibull_min(self.beta, scale=self.eeta)
                return weibull_dist.expect(lambda x: x)

        # Create n identical components with the same parameters
        component_list = [Component(eeta, beta, rt) for _ in range(n)]

        def objective(t):
            return (pmdt + sum(((i.failure(t) + i.integral(t)) * i.rt) for i in component_list)) / t

        t_initial = 1
        bounds = [(1, 10000)]

        result = minimize(objective, t_initial, bounds=bounds)

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
            return ((beta/eeta) * ((t / eeta) ** (beta - 1)) * reliability(t))

        def integral(t):
            result, error = integrate.quad(lambda x: (
                (failure(t-x)) * weibullpdf(x) / (1 - (0.5 * (failure(t-x))))), 0, t)
            return result

        def objective(t):
            return ((cp + (cf * (failure(t) + integral(t)))) / t)

        t_initial = 1
        bounds = [(1, expected_value)]

        result = minimize(objective, t_initial, bounds=bounds)
        return jsonify({
            't': result.x[0],
            'objective_value': result.fun
        })

    elif method == 'risk_target':
        beta = float(data.get('beta'))
        eeta = float(data.get('eeta'))
        p_values = [0.8, 0.85, 0.9, 0.95]
        t_values = []

        for p in p_values:
            t = sp.Symbol('t')
            equation = sp.Eq(1 - sp.exp(-((t / eeta) ** beta)) - p, 0)
            solution = sp.nsolve(equation, t, 1.0, solver='mnewton')
            t_values.append(float(solution))

        return jsonify({
            't': t_values
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
            return ((beta/eeta) * ((t / eeta) ** (beta - 1)) * reliability(t))

        def integral(t):
            result, error = integrate.quad(lambda x: (
                (failure(t-x)) * weibullpdf(x) / (1 - (0.5 * (failure(t-x))))), 0, t)
            return result

        def objective(t):
            return ((dp + (df * (failure(t) + integral(t)))) / t)

        t_initial = 1
        bounds = [(1, expected_value)]

        result = minimize(objective, t_initial, bounds=bounds)
        return jsonify({
            't': result.x[0],
            'objective_value': result.fun
        })

    else:
        return jsonify({
            'error': 'Invalid method provided'
        }), 400
