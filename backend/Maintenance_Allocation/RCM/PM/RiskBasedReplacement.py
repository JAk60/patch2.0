import sympy as sp

beta = float(input("Enter beta value: "))
eeta = float(input("Enter eeta value: "))
p = float(input("Enter acceptable probability of failure: "))

t = sp.Symbol('t')

# Define the equation
equation = sp.Eq(1 - sp.exp(-((t / eeta) ** beta)) - p, 0)

solutions = sp.nsolve(equation, t, 1.0, solver='mnewton')

print(solutions)
