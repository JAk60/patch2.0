import pyodbc
server = 'LAPTOP-2TO4CUDO\SQLEXPRESS'
database = 'indian_navy'
username = 'LAPTOP-2TO4CUDO\Pradeep'
password = ''
# cnxn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};SERVER=' +
#                       server+';DATABASE='+database+';UID='+username+';PWD=' + password)


# cnxn = pyodbc.connect(r'Driver=SQL Server;Server=localhost;Database=master;Trusted_Connection=yes;')

cnxn = pyodbc.connect(driver='{SQL Server}', server='LAPTOP-2TO4CUDO\SQLEXPRESS', database='indian_navy',               
               trusted_connection='yes', port=1433)
# SELECT name FROM sys.columns WHERE object_id = OBJECT_ID('indian_navy.dbo.system_configuration')
cursor = cnxn.cursor()
print("hello")
