import pyodbc, sys
# Some other example server values are
# server = 'localhost\sqlexpress' # for a named instance
# server = 'myserver,port' # to specify an alternate port
# server = 'tcp:10.34.1.7' 
# database = 'QSYSTEMS' 
# username = 'sa' 
# password = 'sql' 
# cnxn = pyodbc.connect('DRIVER={SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+password)
# #str="Modern_Spanish_CI_AS"
# cnxn.setdecoding(pyodbc.SQL_CHAR, encoding='CP850')
# cnxn.setdecoding(pyodbc.SQL_WCHAR, encoding='CP850')
# cursor = cnxn.cursor()

# #data =cursor.execute("select  VEN_NOMBRE  from VENDEDOR WHERE VEN_CODIGO = 604").fetchone()
# #nombre = data.nombre.VEN_NOMBRE
# data =cursor.execute("select DICVL_FECHA, DICVL_HORA from  dbo.DIST_INVCLIVENDL" ).fetchmany()

cnxn = pyodbc.connect('DRIVER={SQL Server};SERVER='+'tcp:10.34.1.7'+';DATABASE='+'QSYSTEMS'+';UID='+'sa'+';PWD='+'sql')
cnxn.setdecoding(pyodbc.SQL_CHAR, encoding='CP850')
cnxn.setdecoding(pyodbc.SQL_WCHAR, encoding='CP850')
# print (list(data))

#print (list(data))
# for d in data:
#     print (d)

sys.path.append('../..')
from Application.connect_server import *

conn = Connection()
conn.config.filename = '../config/odbc.ini'
cursor = conn.cursor()
# version= cursor.execute('SELECT @@VERSION')
# for it in version.fetchone():
#     print (it)

import pandas as pd 
import os
from datetime import *
from pprint import pprint
target = r'test'

today = target + os.sep + time().strftime('%Y%m%d')

if not os.path.exists(today):
    os.mkdir(today)

# result = "SELECT * FROM OE_TAT where convert(date,Time_IST)=?"
# df = pd.read_sql_query(result, connection, params=(dateval,))    

data = conn.cursor().execute("""INSERT INTO DIST_INVDEVOLCLIH(
DINDCH_EMPRESA,       
DINDCH_DEVNUMERO,     
DINDCH_VENDEDOR,      
DINDCH_CLICODIGO,     
DINDCH_FECHA,         
DINDCH_TIPDEV,        
DINDCH_NUMRECL,       
DINDCH_FECHARECLA,    
DINDCH_STATUS,        
DINDCH_NUMINVEN,      
DINDCH_TIPINGRESO,    
DINDCH_HORA,          
DINDCH_TOTAL
)
VALUES ( ?, ?, ?, ?, convert(int, getdate()), ?, ?, convert(int, convert(datetime, ?) ), ?, ?, ?,?,? )""")



# data = conn.cursor().execute("SELECT * FROM USUARIOS").fetchall()
# P_data = pd.read_sql("SELECT * FROM USUARIOS", conn)
# P_data.to_excel("excel"++".xlsx")


from flask import make_response

# @app.route('/docs/<id>')
# def get_pdf(id=None):
#     if id is not None:
#         binary_pdf = get_binary_pdf_data_from_database(id=id)
#         response = make_response(binary_pdf)
#         response.headers['Content-Type'] = 'application/pdf'
#         response.headers['Content-Disposition'] = \
#             'inline; filename=%s.pdf' % 'yourfilename'
#         return response

# <embed src="/docs/pdfid8676etc" width="500" height="375">

# jinja template
#<embed src="/docs/{{doc_id}}">
# from flask import render_template

# @app.route('/<id>')
# def show_pdf(id=None):
#     if id is not None:
#         return render_template('doc.html', doc_id=id)



# from flask import send_file, current_app as app

# @app.route('/show/static-pdf/')
# def show_static_pdf():
#     with open('/path/of/file.pdf', 'rb') as static_file:
#         return send_file(static_file, attachment_filename='file.pdf')