from flask import Blueprint
from flask import render_template
from flask import request, Response
from flask  import jsonify, abort
from flask import json 
from Application.auth import login_required
from Application.breadcrumb import breadcrumb

from Application.connect_server import mssql_connect, Connection
#from Application.operaciones import query_clientes
from Application.tools.serializer import serializer
from Application.SQL.DEVOLUCION import *
from Application.SQL.REFUND_INSERT import *
#manipulacion de fecha y hora para formato ordinal
from Application.tools.date_convert import Date, Time

bp = Blueprint('clientes', __name__, url_prefix='/operaciones')

@bp.route('/clientes', methods=('GET', 'POST'))
@breadcrumb('Operaciones de Clientes')
@login_required
def clientes():
    form = None
    if request.method == 'POST':
        form = request.form
        update_value_form(form)
    if request.method == 'GET':
        valor = request.values.get('id')
        print (valor)
    return render_template('operaciones/clientes.html')


@bp.route("/get/tiendawallmart/<int:id>")
@login_required
def gln_walmart(id):
    conn = mssql_connect()
    query = GLN_WALMART.format(id)
    consult = conn.cursor().execute(query)
    res = serializer(consult)
    print (consult)
    print (jsonify(res))
    return jsonify(res)



@bp.route("/get/cliente/<string:codigo_cliente>")
@login_required
def buscar_clientes(codigo_cliente):
    conn = mssql_connect()
    query = CLIENTE % ("'"+codigo_cliente+"'", "'PAN'")
    consult = conn.cursor().execute(query)
    res = serializer(consult)
    print (consult)
    print (jsonify(res))
    return jsonify(res)

@bp.route("/get/ref/<string:texto>")
@login_required
def buscar_referencia(texto):
    print(texto)
    conn = mssql_connect()
    consult = conn.cursor().execute(REF, texto)
    res = serializer(consult)
    print (consult)
    print (jsonify(res))
    return jsonify(res)


@bp.route("/get/cliente_nombre/<string:texto>")
@login_required
def buscar_clientes_nombre(texto):
    print(texto)
    conn = mssql_connect()
    query = CLIENTE_NOMBRE.format(texto) 
    consult = conn.cursor().execute(query)
    res = serializer(consult)
    print (consult)
    print (jsonify(res))
    return jsonify(res)


@bp.route("/get/producto/<string:datos>", methods=('GET', 'POST'))
@login_required
def buscar_producto(datos):
    print(datos)
    id_producto = datos.split(",")[0]
    id_cliente = datos.split(",")[1]
    id_empresa = datos.split(",")[2]
    conn = mssql_connect()
    query = PRODUCTO.format(id_producto, id_cliente, id_empresa)
    consult = conn.cursor().execute(query)
    res = serializer(consult)
    print (consult)
    print (jsonify(res))
    return jsonify(res)    



@bp.route("/set/devolucion/<string:datos>", methods=('GET', 'POST'))
@login_required
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
        str(dev_recibida[4]),                       # N. REFENCIA
        dev_recibida[5],                            # lote
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


@bp.route("/get/devolucion/<string:texto>")
@login_required
def buscar_registro_devolucion(texto):
    print(texto)
    conn = mssql_connect()
    consult = conn.cursor().execute(GET_REGISTRO_DEVOLUCION, texto)
    res = serializer(consult)
    print (consult)
    print (jsonify(res))
    return jsonify(res)


@bp.route("/view/devolucion/<string:texto>")
@login_required
def view_operacion_cliente(texto):
    print(texto)
    conn = mssql_connect()
    consult = conn.cursor().execute(GET_REGISTRO_DEVOLUCION, texto)
    res = serializer(consult)
    data = res
    print (data)
    print(json.dumps(data))
    if len(data) > 0:
        #return "<script> var obj= JSON.parse('" + json.dumps(res)+"'); </script>"
        return render_template('view/vista_devolucion_cliente.html', dev = data)
    elif len(data) == 0:
        return render_template('buscar/buscar_devolucion.html')
    else:
        return abort(404)
    #res = serializer(consult)
    # else:
    #     return render_template('operaciones/vista/view_cliente.html', registro= data)

