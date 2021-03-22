from flask import g
from flask import jsonify
from flask import json 
from werkzeug.wrappers import CommonResponseDescriptorsMixin

from Application.connect_server import mssql_connect, Connection
from Application.tools.date_convert import Date, Time
from Application.SQL.REFUND_INSERT import *


# """
#     las devoluciones afectan a las tablas:
#     DIST_INVCLIVENDL //
#     // ESTA TABLA GUARDA EL ENCABEZADO DE LA DEVOLUCION
#     // DEVNUMERO, VENDEDOR(CODIGO), CLICODIGO, FECHA(INGRESO DE DATOS),TIPDEV, NUMRECL (NUMERO RECLAMO),
#     // LOTERECL (NUMERO LOTE RECLAMO), FECHARECLA (FECHA_RECLAMO), STATUS (DEFAULT V), NUMINVEN (DEFAULT 0)
#     // TIPOINGRESO (DEFAULT V), HORA (HAY QUE CONVERTIR A UN INTEGER )
#     DIST_INVDEVOLCLIH{
#         EMPRESA,
#         NUMERO DE DEVOLUCION = {
#             DECLARE @NUMERO_DEV INT
#             SET @NUMERO_DEV = (SELECT CORR_NUMERO FROM CORRELATIVO WHERE CORR_TIPO = 'DCD')
#             SELECT (@NUMERO_DEV+1) AS CORR_NUMERO
#         }
#     CODIGO VENDEDOR, CODIGO CLIENTE
#     FECHA, TIPO DEVOLUCION {"CAMBIO DIRECOT":"C", "WALMART RECAMBIO":R, "TORRE VALE": V }
#     }
#     //ESTA TABLA CONTIENE DEVNUMERO, LINEA, INVENTARIO(CODIGO PRODUCTO), CANTIDAD
#     DIST_INVDEVOLCLIL
# """
# si hay una respuesta post y esta contiene un formulario entonces se procesa para guardarse en la base de datos

def insert_value_form(post_object_form):
    # al terminar de hacer todas las comprobaciones
    # se busca el numero del registro y le sumamos uno para guardar el nuevo,
    conn = mssql_connect()
   

    code_saleman = post_object_form['vendedor']
    code_customer = post_object_form['cliente']
    date = Date().to_ordinal(post_object_form['fecha'])
    hour = Time().to_ordinal(post_object_form['hora'])
    concept = post_object_form['concepto']
    number_refund = post_object_form['reclamo']
    lote = post_object_form['lote']
    date_refund = Date().to_ordinal(post_object_form['fecha_reclamo'])
    codigo = post_object_form.getlist('codigo_producto')
    cant = post_object_form.getlist('producto')
    precio = post_object_form.getlist('precio_unitario')

    # rutina para agrupar datos de un producto 
    #print ("tipo:{0}  - valor {1}".format(type(correlativo), correlativo[0]))
    correlativo = conn.cursor().execute(refund_number).fetchone()
    dev_numero = correlativo[0]+1 #correlativo + 1

    #agregamos la linea de devoluciones a la tabla DIST_INVDEVOLCLIL
    productos = []

    isNoneListProduct = 0
    for i in range(0, len(cant)):
        linea = i
        # reagrupados los datos del producto por cuando cantidad es direrente a Cero o None
        if (cant[i] != '') and (len(cant[i]) > 0) and (len(precio[i]) > 0):
            # numero_linea, codigo, cantidad y precio
            item = (g.empresa_codigo,dev_numero,linea+1, codigo[i], float(cant[i]), float(precio[i]),0.0, 0.0)
            # y lo guardamos en una lista
            productos.append(item)
            #incrementamos en 1 el contador para saver que no esta vacio el formulario
            isNoneListProduct +=1            
    
    if isNoneListProduct >=1:
        # char(3), int, 
        conn_insert = Connection().mssql()
        ## INSERT TABLE DIST_INVDEVOLCLIH
        conn_insert.execute(
            insert_refund, 
            g.empresa_codigo,
            dev_numero, 
            code_saleman, 
            code_customer, 
            date, 
            concept, 
            number_refund, 
            lote, 
            date_refund,
            'V', 
            0, 
            'V', 
            int(hour)
        )
        
        print ( g.empresa_codigo,dev_numero, code_saleman, code_customer, date, concept,number_refund,lote,date_refund, 'V', 0, 'V', hour)        
        for p  in productos:
            #INSERT TABLE DIST_INVDEVOLCLIL
            conn_insert.execute(insert_refund_lines, p[0], p[1], p[2], p[3], p[4], p[5], p[6])
            print(p[0], p[1], p[2], p[3], p[4], p[5], p[6],0)
        
        ## update correlativo
        conn_insert.execute(update_correlativo, dev_numero)
        conn_insert.commit()
    else:
        print("no se pudo realizar la accion")


def update_value_form(post_object_form):
    # al terminar de hacer todas las comprobaciones
    # se busca el numero del registro y le sumamos uno para guardar el nuevo,
    conn = mssql_connect()
   
    dev_numero = post_object_form['numero']
    code_saleman = post_object_form['vendedor']
    code_customer = post_object_form['cliente']
    date = Date().to_ordinal(post_object_form['fecha'])
    hour = Time().to_ordinal(post_object_form['hora'])
    concept = post_object_form['concepto']
    number_refund = post_object_form['reclamo']
    lote = post_object_form['lote']
    date_refund = Date().to_ordinal(post_object_form['fecha_reclamo'])
    codigo = post_object_form.getlist('codigo_producto')
    cant = post_object_form.getlist('producto')
    precio = post_object_form.getlist('precio_unitario')

    # rutina para agrupar datos de un producto 
    #print ("tipo:{0}  - valor {1}".format(type(correlativo), correlativo[0]))

    #agregamos la linea de devoluciones a la tabla DIST_INVDEVOLCLIL
    productos = []

    isNoneListProduct = 0
    for i in range(0, len(cant)):
        linea = i
        # reagrupados los datos del producto por cuando cantidad es direrente a Cero o None
        if (cant[i] != '') and (len(cant[i]) > 0) and (len(precio[i]) > 0):
            # numero_linea, codigo, cantidad y precio
            item = (g.empresa_codigo,dev_numero,linea+1, codigo[i], float(cant[i]), float(precio[i]),0.0, 0.0)
            # y lo guardamos en una lista
            productos.append(item)
            #incrementamos en 1 el contador para saver que no esta vacio el formulario
            isNoneListProduct +=1            
    
    if isNoneListProduct >=1:
        # char(3), int, 
        conn_insert = Connection().mssql()
        ## INSERT TABLE DIST_INVDEVOLCLIH
        conn_insert.execute(
            update_refund, 
            code_saleman, 
            code_customer, 
            date, 
            concept, 
            number_refund, 
            lote, 
            date_refund,
            'V', 
            0, 
            'V', 
            int(hour),
            g.empresa_codigo,
            dev_numero
        )
        
        print (code_saleman, code_customer, date, concept,number_refund,lote,date_refund, 'V', 0, 'V', hour, g.empresa_codigo,dev_numero)
        for p  in productos:
            #INSERT TABLE DIST_INVDEVOLCLIL
            conn_insert.execute(
                update_refund_lines, 
                p[3], 
                p[4], 
                p[5], 
                p[6], 
                p[0], 
                p[1], 
                p[2]
            )
            print(p[3], p[4], p[5], p[6], p[0], p[1], p[2])
        
        ## update correlativo
        conn_insert.execute(update_correlativo, dev_numero)
        conn_insert.commit()
    else:
        print("no se pudo realizar la accion")




def get_dataform(form):
    conn = mssql_connect()
    correlativo = conn.cursor().execute("SELECT * FROM CORRELATIVO WHERE CORR_TIPO = 'DCD'")

    lista_productos = []

    code_saleman = form['vendedor']
    customer = form['cliente']
    date = form['fecha']
    time = form['hora']
    concept = form['concepto']
    number_refund = form['reclamo']
    lote = form['lote']
    date_refund = form['fecha_reclamo']
    codigo = form.getlist('codigo_producto')
    cant = form.getlist('producto')
    precio = form.getlist('precio_unitario')

    # rutina para agrupar datos de un producto 
    for i in range(0, len(cant)):
        linea = i
        # reagrupados los datos del producto por cuando cantidad es direrente a Cero o None
        if (cant[i] != '') and (len(cant[i]) > 0) and (len(precio[i]) > 0):
            # numero_linea, codigo, cantidad y precio
            producto = (linea+1, codigo[i], float(cant[i]), float(precio[i]))
            # y lo guardamos en una lista
            lista_productos.append(producto)
            
    
    data_to_save = []
    data_to_save.append(g.empresa_codigo)
    data_to_save.append( code_saleman)
    data_to_save.append(customer)
    data_to_save.append(Date().to_ordinal(date))
    data_to_save.append(Time().to_ordinal(time))
    data_to_save.append(Date().to_ordinal(date_refund))
    data_to_save.append(concept)
    data_to_save.append(number_refund)
    data_to_save.append(lote)

    data_to_save.append(lista_productos)

    for iterator in data_to_save:
        if isinstance(iterator, list):
            for item in iterator:
                if len(item) == 4:
                    print (item[0], item[1], item[2], item[3])
                else:
                    print (item)                
        else:
            print(iterator)
    
    print("\n-------------------------------------------------------------------\n")
    print(data_to_save)
    print("\n-------------------------------------------------------------------\n")



def response_json(result_fetchall):
    data = []
    lista = result_fetchall
    for row in lista:
        data.append([x for x in row])
        # creamos una respuesta de tipo json para el navegador si hay data 
        response = jsonify(
            response=json.dumps(data),
            status=200,
            mimetype='application/json'
        )
        return response