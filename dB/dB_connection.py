import pyodbc
server = 'localhost\MSSQLSERVER01'
database = 'netra_indian_navy'
username = 'sa'
password = 'Previtix@1324'
# cnxn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER=' +
#                       server+';DATABASE='+database+';UID='+username+';PWD=' + password)


# cnxn = pyodbc.connect(r'Driver=SQL Server;Server=localhost;Database=master;Trusted_Connection=yes;')

cnxn = pyodbc.connect(
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=localhost;"
    "DATABASE=NetraD;"
    "UID=sa;"
    "PWD=Avishkar@171803"
)
cursor = cnxn.cursor()
print("hello")
src = pyodbc.connect(
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=localhost;"
    "DATABASE=CMMSIITB;"
    "UID=sa;"
    "PWD=Avishkar@171803"
)

pointer = src.cursor()
print("world")
