import pyodbc 
from pprint import pprint
from serializer import serializer
# Some other example server values are
# server = 'localhost\sqlexpress' # for a named instance
# server = 'myserver,port' # to specify an alternate port
server = 'tcp:10.34.1.7' 
database = 'QSYSTEMS' 
username = 'sa' 
password = 'sql' 
cnxn = pyodbc.connect('DRIVER={SQL Server};SERVER='+server+';DATABASE='+database+';UID='+username+';PWD='+password)
#str="Modern_Spanish_CI_AS"
cnxn.setdecoding(pyodbc.SQL_CHAR, encoding='CP850')
cnxn.setdecoding(pyodbc.SQL_WCHAR, encoding='CP850')
cursor = cnxn.cursor()

#data =cursor.execute("select  VEN_NOMBRE  from VENDEDOR WHERE VEN_CODIGO = 604").fetchone()
#nombre = data.nombre.VEN_NOMBRE
refund_number =  2486
data = cursor.execute(
    "\
    SELECT  \
        DD.DINDCH_EMPRESA AS EMPRESA,   \
        DD.DINDCH_DEVNUMERO AS NUMERO_DEVOLUCION,   \
        DD.DINDCH_VENDEDOR AS CODIGO_VENDEDOR,  \
        DD.DINDCH_FECHA AS FECHA_INGRESO_DEVOLUCION,    \
        DD.DINDCH_NUMRECL AS NUMERO_DOCUMENTO_RECLAMO,  \
        DD.DINDCH_LOTERECL AS NUMERO_LOTE_RECLAMO,  \
        DD.DINDCH_FECHARECLA AS FECHA_RECLAMO,  \
        DD.DINDCH_STATUS AS STATUS, \
        DD.DINDCH_NUMINVEN AS NUMERO_DE_INVENTARIO, \
        DD.DINDCH_TIPINGRESO AS TIPO_INGRESO,   \
        DD.DINDCH_HORA AS HORA, \
        DD.DINOCH_TOTAL AS TOTAL,   \
        DL.DINDCL_DEVNUMERO AS NUMERO_DEVOLUCION,   \
        DL.DINDCL_LINEA AS NUMERO_LINEA_DEVOLCION,  \
        DL.DINDCL_INVENTARIO AS CODIGO_PRODUCTO,    \
        DL.DINDCL_CANTIDAD AS CANTIDAD, \
        DL.DINDCL_PRECIOUCLI AS PRECIO_UNIDAD_CLIENTE,  \
        DL.DINDCL_PRECIOUVEN AS PRECIO_UNIDAD_VENDEDOR, \
        DL.DINDCL_COSTO AS COSTO    \
    FROM DIST_INVDEVOLCLIH DD   \
        LEFT JOIN DIST_INVDEVOLCLIL DL  \
    ON DINDCH_DEVNUMERO = DINDCL_DEVNUMERO  \
    WHERE DINDCH_DEVNUMERO = ?   ", refund_number)

pprint (serializer(data))


#data =cursor.execute("select top 5 dicvl_vendedor, dicvl_clicodigo, dicvl_fecha from dbo.DIST_INVCLIVENDL" ).fetchmany()
# import datetime
# from datetime import date, time
# from datetime import datetime
# fechaInt = '2020/03/25'
# def convert_date_to_ordinal(date):
#     offset = 693596
#     n = datetime.strptime(date, '%Y/%M/%d').toordinal()
#     return (n-offset)

# #matlab = 693960
# def convert_date_to_excel_ordinal(day, month, year):
#     offset = 693596
#     #offset = 693594 excel date
#     current = date(year,month,day)
#     n = current.toordinal()
#     return (n - offset)-2

# #print ("date to ordinal: {0}".format(convert_date_to_excel_ordinal(25,3,2020)))
# #print ("date: {0}".format(convert_date_to_ordinal(fechaInt)))


# from datetime import datetime
# excel_date = 43913
# #dt = datetime.fromordinal(datetime(1900, 1, 1).toordinal() + excel_date - 2 )
# dt = datetime.fromordinal(datetime(1900, 1, 1).toordinal() + excel_date)
# tt = dt.timetuple()
# edt = datetime.fromordinal(datetime.toordinal(datetime(2020,3,25))  - datetime(1900, 1, 1).toordinal() ).toordinal()

# print (dt)
# print (edt)
# print (tt)
# print ( datetime(1900, 1, 1).toordinal())



# # def convert_time_to_excel_ordinal(hour, minute, second):
# #     #49347     
# #     offset = 693594
# #     current = time(hour,minute,second)
# #     n = current.toordinal()
# #     return (n - offset)-2

# #print ("time to ordinal: {0}".format(convert_time_to_excel_ordinal(14,15,35)))