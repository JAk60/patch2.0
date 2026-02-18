import pyodbc
server = 'localhost\MSSQLSERVER01'
database = 'netra_indian_navy'
username = 'sa'
password = 'Previtix@1324'
# cnxn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER=' +
#                       server+';DATABASE='+database+';UID='+username+';PWD=' + password)


# cnxn = pyodbc.connect(r'Driver=SQL Server;Server=localhost;Database=master;Trusted_Connection=yes;')

cnxn = pyodbc.connect(driver='{SQL Server}', server='LAPTOP-9KHECU3U', database='NetraD',               
               trusted_connection='yes', port=1433)
# SELECT name FROM sys.columns WHERE object_id = OBJECT_ID('netra_indian_navy.dbo.system_configuration')
cursor = cnxn.cursor()
print("hello")
src = pyodbc.connect(driver='{SQL Server}', server='LAPTOP-9KHECU3U', database='CMMSIITB',               
               trusted_connection='yes', port=1433)
# SELECT name FROM sys.columns WHERE object_id = OBJECT_ID('netra_indian_navy.dbo.system_configuration')
pointer = src.cursor()
print("world")
