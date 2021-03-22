from flask  import json, jsonify
from flask.helpers import make_response
from flask import  make_response
from flask import request
from Application.connect_server import mssql_connect
from Application.refund.refund import bp
from Application.tools.serializer import serializer
from Application.tools.date_convert import Date
from Application.SQL import MSSQL_Query

# @bp from  refund  => bp = Blueprint("refund", __name__, url_prefix="/refund")

@bp.route("/api/get/customer_by_saleman/<int:customer_id>")
def get_customer_by_saleman(customer_id):
    conn = mssql_connect()
    customer_saleman = conn.cursor().execute(
        MSSQL_Query.customer_by_saleman, customer_id)
    results = serializer(customer_saleman)
    return  jsonify(results)

@bp.route("/api/get/product_by_saleman/<int:customer_id>")
def get_product_by_saleman(customer_id):
    conn = mssql_connect()
    product_saleman = conn.cursor().execute(
        MSSQL_Query.product_by_saleman, customer_id)
    results = serializer(product_saleman)
    return  jsonify(results)


@bp.route("/api/get/product_refund_by_doc_id/<int:refund_id>")
def get_product_refund_by_doc_id(refund_id):
    conn = mssql_connect()
    refund_data = conn.cursor().execute(MSSQL_Query.product_refund_by_doc_id, refund_id)
    results = serializer(refund_data)
    return jsonify(results)


@bp.route("/api/get/refund_detail_by_id/<int:refund_id>")
def get_refund_detail_by_id(refund_id):
    conn = mssql_connect()
    consult = conn.cursor().execute(
        MSSQL_Query.refund_detail_by_id, refund_id)
    result = serializer(consult)
    return jsonify(result)


@bp.route("/api/get/test/<int:refund_id>")
def get_test(refund_id):
    conn = mssql_connect()
    data = conn.cursor().execute(
        MSSQL_Query.test, refund_id)
    response = make_response(jsonify(serializer(data)))
    response.headers["Content-Type"] = "application/json"
    #response.headers["X-Parachutes"] = "parachutes are cool"
    return response


@bp.route("/api/get/saleman/<int:saleman_id>")
def get_saleman(saleman_id):
    conn = mssql_connect()
    consult = conn.cursor().execute(MSSQL_Query.saleman + "AND V.VEN_CODIGO =?", saleman_id)
    result = serializer(consult)
    return jsonify(result)

@bp.route("/api/get/list_saleman")
def getlist_saleman():
    conn = mssql_connect()
    consult = conn.cursor().execute(MSSQL_Query.saleman)
    result = serializer(consult)
    return jsonify(result)

@bp.route("/api/get/customers")
def getlist_customers():
    conn = mssql_connect()
    consult = conn.cursor().execute(MSSQL_Query.customers)
    result = serializer(consult)
    return jsonify(result)


@bp.route("/api/get/list_refund", methods=('GET', 'POST'))
def getlist_refund():
    print("ok post")
    return jsonify("hola: erick")

    # if request.method == 'post':
    #     form = request.form
    #     campos =[]
    #     fecha = []
    #     # separamos los parametros de filtracion para poder manipular la fecha incial y final de busqueda
    #     lista = ""
    #     filtros =""
    #     result = None
    #     for input in form:
    #         if (input == 'fechaincial') and form[input] != '':
    #             fecha.append(" DINDCH_FECHA <= {}".format(Date().to_ordinal(form[input])))
    #         elif input == 'fechafinal' and form[input] != '':
    #             fecha.append("DINDCH_FECHA >= {}".format(Date().to_ordinal(form[input])))
    #         elif form[input] != '':
    #             campos.append("DINDCH_{} = '{}'".format(input,form[input]))
        
    #     print ('input', fecha )

        # conn = mssql_connect()
        # if fecha and len(campos) == 0:
        #     print(fecha[0] +" AND " + fecha[1] + " ")
        #     lista = conn.cursor().execute(MSSQL_Query.buscar_y_filtrar.format("WHERE "+ fecha[0] +" AND " + fecha[1]  ))
        #     # Creamos un array para poder almacenar la consulta y recorremos la consulta por
        #     #  filas y las añadimos al array data
        #     result = serializer(lista)
        #     return jsonify(result)
            

        # elif fecha and len(campos) >=1:
        #     for f in campos:                
        #         filtros = " AND " + f
        #     lista = conn.cursor().execute(MSSQL_Query.buscar_y_filtrar.format("WHERE "+ fecha[0] +" AND " + fecha[1] + filtros))
        #     # Creamos un array para poder almacenar la consulta y recorremos la consulta por
        #     #  filas y las añadimos al array data
        #     print (MSSQL_Query.buscar_y_filtrar.format("WHERE "+ fecha[0] +" AND " + fecha[1] + filtros))
        #     result = serializer(lista)
        #     return jsonify(result)
            

        # elif campos != "" and len(campos) == 1:            
        #     #print ("filstros: ", campos)
        #     filtros = campos[0]
        #     lista = conn.cursor().execute(MSSQL_Query.buscar_y_filtrar.format("WHERE " + filtros )).fetchall()
        #     result = serializer(lista)
        #     return jsonify(result)
            
        # elif campos != "" and len(campos) == 2:            
        #     #print ("filstros: ", campos)
        #     filtros = campos[0] +" AND "+ campos[1]
        #     lista = conn.cursor().execute(MSSQL_Query.buscar_y_filtrar.format("WHERE " + filtros ))
        #     result = serializer(lista)
        #     return jsonify(result)
            
        # elif campos != "" and len(campos) == 3:            
        #     #print ("filstros: ", campos)
        #     filtros = campos[0] +" AND "+ campos[1] + " AND " + campos[2]
        #     lista = conn.cursor().execute(MSSQL_Query.buscar_y_filtrar.format("WHERE " + filtros ))
        #     result = serializer(lista)
        #     return jsonify(result)
            
@bp.route("/recibir", methods=('GET', 'POST'))
def recibir():
    data = request.get_json()
    return jsonify(data)