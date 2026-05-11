import pyodbc

cnxn = pyodbc.connect(
    "DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=localhost;"
    "DATABASE=NetraD;"
    "UID=sa;"
    "PWD=Avishkar@171803;"
    "TrustServerCertificate=yes;"
)

cursor = cnxn.cursor()
print("Hello")

src = pyodbc.connect(
"DRIVER={ODBC Driver 17 for SQL Server};"
    "SERVER=localhost;"
    "DATABASE=CMMSIITB;"
    "UID=sa;"
    "PWD=Avishkar@171803;"
    "TrustServerCertificate=yes;")
pointer = src.cursor()
print("World")