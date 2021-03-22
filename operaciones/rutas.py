from flask import Blueprint
from flask import render_template
from flask import request, Response
from flask  import jsonify
from flask import json 
from Application.auth import login_required
from Application.breadcrumb import breadcrumb

from Application.connect_server import mssql_connect
from Application.SQL.DEVOLUCION import *

from Application.tools.serializer import serializer

bp = Blueprint('rutas', __name__, url_prefix='/operaciones')

@bp.route('/rutas', methods=('GET', 'POST'))
@breadcrumb('Operaciones de Rutas')
@login_required
def clientes():
    return render_template('operaciones/rutas.html')

@bp.route("/get/devolucion/datos", methods=('GET', 'POST'))
def buscar_devolucion_id(datos):
    conn = mssql_connect()
    consult = conn.cursor().execute(BUSCAR_DEV,datos)
    res = serializer(consult)
    print (consult)
    print (jsonify(res))
    return jsonify(res)



@bp.route("/get/ruta/<string:datos>")
def buscar_ruta(datos):
    ruta = datos.split(",")[0]
    empresa = datos.split(",")[1]
    conn = mssql_connect()    
    consult = conn.cursor().execute(RUTA,ruta, empresa)
    res = serializer(consult)
    print (consult)
    print (jsonify(res))
    return jsonify(res)


@bp.route("/get/cliente_ruta/<string:datos>")
def buscar_clientes_ruta(datos):
    ruta = datos.split(",")[0]
    empresa = datos.split(",")[1]
    conn = mssql_connect()    
    consult = conn.cursor().execute(CLIENTE_RUTA, ruta, empresa)
    res = serializer(consult)
    print (consult)
    print (jsonify(res))
    return jsonify(res)

@bp.route("/get/producto_ruta/<string:datos>", methods=('GET', 'POST'))
def buscar_producto_ruta(datos):
    print(datos)
    id_producto = datos.split(",")[0]
    id_ruta = datos.split(",")[1]
    id_empresa = datos.split(",")[2]
    conn = mssql_connect()
    consult = conn.cursor().execute(PRODUCTO_RUTA,id_producto, id_ruta, id_empresa,id_empresa)
    res = serializer(consult)
    print (consult)
    print (jsonify(res))
    return jsonify(res)   

@bp.route("/get/cliente_externo/<string:cliente_externo>", methods=('GET', 'POST'))
def buscar_cliente_externo(cliente_externo):
    conn = mssql_connect()
    consult = conn.cursor().execute(CLIENTE_EXTERNO,cliente_externo, 'PAN')
    res = serializer(consult)
    print (consult)
    print (jsonify(res))
    return jsonify(res)

@bp.route("/set/devolucion/<string:datos>", methods=('GET', 'POST'))
def devolucion(datos):
    print(datos)
    dev_recibida = datos.split(",")
    # for i in range(7):
    #     print (dev_recibida[i])

    # #print ("----------------------------{0}---------------------------------------".format(len(dev_recibida)-1))
    # for i in range(7,len(dev_recibida)-1):
    #     print(dev_recibida[i])


    # ESTABLECEMOS CONEXION
    conn = mssql_connect()
    #
    #   INSERT DE CABECERA DEVOLUCION EN TABLA 
    #   SELECT * FROM q  QSYSTEMS.dbo.DIST_INVDEVOLCLIH
    #
    
    correlativo = conn.cursor().execute(refund_number).fetchone()
    dev_numero = correlativo[0]+1 #correlativo + 1
    conn_insert = Connection().mssql()
    fecha_reclamo = ("convert(int, convert(datetime, N'{0}') )").format(dev_recibida[5])
    fecha_creacion = "convert(int, getdate())"
    V = "V"
    print(
        dev_recibida[0],                            # EMPRESA
        int(dev_numero),                            # CORRELATIVO
        dev_recibida[1],                            # CODIGO RUTA
        dev_recibida[2],                            # CODIGO CLIENTE
        str(Date().current_now.strftime('%Y%m%d')),
        dev_recibida[3],                            # TIPO DEVOLUCION
        str(dev_recibida[4]),                       # N. REFENCIA
        dev_recibida[5],                            # lote
        str(dev_recibida[6]),                       # FECHA DEVOLUCION
        V,                                          # DATOS QSYSTEMS
        0,                                          # DATOS QSYSTEMS
        str(dev_recibida[7]),                       # TIPO INGRESO   
        int(Time().to_ordinal((Time().time_now))),  # HORA DE INGRESO
        dev_recibida[8]                             # MONTO TOTAL DEVOLUCION    
     )

    conn_insert.execute( INSERT_HEADER_DEVOLUCION,
        dev_recibida[0],                            # EMPRESA
        int(dev_numero),                            # CORRELATIVO
        dev_recibida[1],                            # CODIGO RUTA
        dev_recibida[2],                            # CODIGO CLIENTE
        str(Date().current_now.strftime('%Y%m%d')),
        dev_recibida[3],                            # TIPO DEVOLUCION
        str(dev_recibida[4]),                                         # N. REFENCIA str(dev_recibida[4])
        dev_recibida[5],                                         # lote dev_recibida[5]
        Date().new_format(dev_recibida[6], "%Y-%m-%d", "%Y%m%d"),                       # FECHA DEVOLUCION
        V,                                          # DATOS QSYSTEMS
        0,                                          # DATOS QSYSTEMS
        dev_recibida[7],                            # TIPO INGRESO   
        int(Time().to_ordinal((Time().time_now))),  # HORA DE INGRESO
        dev_recibida[8]                             # MONTO TOTAL DEVOLUCION    
     )

    #   INSERT DE CABECERA DEVOLUCION EN TABLA 
    #   SELECT * FROM q  QSYSTEMS.dbo.DIST_INVDEVOLCLIH
    #

    print("len de datos: ", len(dev_recibida)-9)
    
    numero_lineas = len(dev_recibida)-1
    
    for linea in range(9, numero_lineas):
        item = dev_recibida[linea].split("|")
        print(dev_recibida[0], int(dev_numero), item[0], item[1], item[2], item[3],0,0,item[4],item[5][0:1])

        conn_insert.execute(
            INSERT_LINEA_DEVOLUCION,
            dev_recibida[0],       # EMPRESA
            int(dev_numero),       # CORRELATIVO
            int(item[0]),          # N. LINEA
            str(item[1]),          # CODIGO PRODUCTO
            float(item[2]),        # CANTIDAD
            float(item[3]),        # PRECIO UNIDAD
            float(0),              # PRECIO U VENDEDOR
            float(0),              # COSTO
            float(item[4]),        # COSTO TOTAL
            (item[5][0:1]).upper() # CAUSA DEVOLUCION  'B', 'C', 'M'
        )    
    # ACTUALIZAMOS EL CORRELATIVO 
    conn_insert.execute(UPDATE_CORR_NUMERO, int(dev_numero))
    # CONFIRMAMOS E INSERTAMOS LOS DATOS 
    conn_insert.commit()
    
    # return jsonify("Successfull")
    return jsonify(dev_numero)