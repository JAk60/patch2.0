import pyodbc

cnxn = pyodbc.connect(driver='{SQL Server}', server='LAPTOP-9KHECU3U', database='NetraD',               
               trusted_connection='yes', port=1433)

cursor = cnxn.cursor()
print("hello")
src = pyodbc.connect(driver='{SQL Server}', server='LAPTOP-9KHECU3U', database='CMMSIITB',               
               trusted_connection='yes', port=1433)
# SELECT name FROM sys.columns WHERE object_id = OBJECT_ID('netra_indian_navy.dbo.system_configuration')
pointer = src.cursor()
print("world")