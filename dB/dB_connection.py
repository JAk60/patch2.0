import pyodbc
server = 'localhost\MSSQLSERVER01'
database = 'indian_navy'
username = 'sa'
password = 'Previtix@1324'
# cnxn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER=' +
#                       server+';DATABASE='+database+';UID='+username+';PWD=' + password)

import pyodbc
server = 'localhost\MSSQLSERVER01'
database = 'indian_navy'
username = 'sa'
password = 'Previtix@1324'
# cnxn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER=' +
#                       server+';DATABASE='+database+';UID='+username+';PWD=' + password)


# cnxn = pyodbc.connect(r'Driver=SQL Server;Server=localhost;Database=master;Trusted_Connection=yes;')

cnxn = pyodbc.connect(driver='{SQL Server}', server='PATHU\SQLEXPRESS02', database='indian_navy',               
               trusted_connection='yes', port=1433)
# SELECT name FROM sys.columns WHERE object_id = OBJECT_ID('indian_navy.dbo.system_configuration')
cursor = cnxn.cursor()
print("hello")


