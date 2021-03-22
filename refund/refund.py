

from flask import Blueprint
from flask import render_template
from flask import request, Response
from flask  import jsonify
from flask import json 
from Application.auth import login_required
from Application.breadcrumb import breadcrumb

from Application.refund.utility import insert_value_form, update_value_form, response_json
from Application.tools.serializer import serializer
from Application.tools.date_convert import  Date
from Application.connect_server import mssql_connect
from Application.SQL import MSSQL_Query





bp = Blueprint('refund', __name__, url_prefix='/refund')

@bp.route('/', methods=('GET', 'POST'))
@breadcrumb('Control de Devoluciones')
@login_required
def refund():
    # if request.method == 'POST':
    #     data = request.get_json()
    #     if data:
    #         for d in data:
    #             print(d)
    #     else:
    #         return Response({'reponse': 'Data Emty'},status=204,mimetype="application/json" )

    if request.method == 'POST':
        form = request.form
        insert_value_form(form)

    return render_template('form/refund/refund_control.html')


@bp.route('/new')
@breadcrumb('Devoluciones / Nuevo Registro')
@login_required
def refund_new():
    return render_template('form/refund/refund.html')


@bp.route('/buscar', methods=('GET', 'POST'))
@breadcrumb('Buscar Devoluciones')
@login_required
def search():
    form = None
    if request.method == 'POST':
        form = request.form
        update_value_form(form)
    if request.method == 'GET':
        valor = request.values.get('id')
        print (valor)

    return render_template('form/refund/refund_search.html')


@bp.route('/list', methods=('GET', 'POST'))
@breadcrumb('Listar Devoluciones')
@login_required
def list():

    if request.method == 'POST':
        form = request.form
        campos =[]
        fecha = []
        # separamos los parametros de filtracion para poder manipular la fecha incial y final de busqueda
        lista = ""
        filtros =""
        for input in form:
            if (input == 'fechaincial') and form[input] != '':
                fecha.append(" DINDCH_FECHA >= {}".format(Date().to_ordinal(form[input])))
            elif input == 'fechafinal' and form[input] != '':
                fecha.append("DINDCH_FECHA <= {}".format(Date().to_ordinal(form[input])))
            elif form[input] != '':
                campos.append("DINDCH_{} = '{}'".format(input,form[input]))

        conn = mssql_connect()
        if not form:
            lista = conn.cursor().execute(MSSQL_Query.buscar_y_filtrar.format(" "))
            result = serializer(lista)
            print (lista)
            print (jsonify(result))
            return jsonify(result)

        if fecha and len(campos) == 0:
            print(fecha[0] +" AND " + fecha[1] + " ")
            lista = conn.cursor().execute(MSSQL_Query.buscar_y_filtrar.format("WHERE "+ fecha[0] +" AND " + fecha[1]  ))
            # Creamos un array para poder almacenar la consulta y recorremos la consulta por
            #  filas y las añadimos al array data
            result = serializer(lista)
            print (lista)
            print (jsonify(result))
            return jsonify(result)


        elif fecha and len(campos) >=1:
            for f in campos:                
                filtros = " AND " + f
            lista = conn.cursor().execute(MSSQL_Query.buscar_y_filtrar.format("WHERE "+ fecha[0] +" AND " + fecha[1] + filtros))
            # Creamos un array para poder almacenar la consulta y recorremos la consulta por
            #  filas y las añadimos al array data
            print (MSSQL_Query.buscar_y_filtrar.format("WHERE "+ fecha[0] +" AND " + fecha[1] + filtros))
            result = serializer(lista)
            print (lista)
            print (jsonify(result))
            return jsonify(result)

        elif campos != "" and len(campos) == 1:            
            #print ("filstros: ", campos)
            filtros = campos[0]
            lista = conn.cursor().execute(MSSQL_Query.buscar_y_filtrar.format("WHERE " + filtros ))
            print(MSSQL_Query.buscar_y_filtrar.format("WHERE " + filtros ))
            result = serializer(lista)
            print (lista)
            print (jsonify(result))
            return jsonify(result)
            
        elif campos != "" and len(campos) == 2:            
            #print ("filstros: ", campos)
            filtros = campos[0] +" AND "+ campos[1]
            lista = conn.cursor().execute(MSSQL_Query.buscar_y_filtrar.format("WHERE " + filtros ))
            result = serializer(lista)
            print (lista)
            print (jsonify(result))
            return jsonify(result)

        elif campos != "" and len(campos) == 3:            
            #print ("filstros: ", campos)
            filtros = campos[0] +" AND "+ campos[1] + " AND " + campos[2]
            lista = conn.cursor().execute(MSSQL_Query.buscar_y_filtrar.format("WHERE " + filtros ))
            result = serializer(lista)
            print (lista)
            print (jsonify(result))
            return jsonify(result)

        #conn = mssql_connect()
        #lista = conn.cursor().execute(MSSQL_Query.buscar_y_filtrar.format("WHERE CLIENTE.CLI_CODIGO ='4571'")).fetchall()
        #print (lista)



    return render_template('form/refund/refund_list.html')

@bp.route('/list/id.json', methods=['GET'])
def list_refund_id():
    if request.method == 'GET':
        conn = mssql_connect()
        customer_saleman = conn.cursor().execute(
        MSSQL_Query.customer_by_saleman, 999)
        results = serializer(customer_saleman)    
        data = jsonify(results)
        print(data)
        return data
        # return Response(data,status=200,mimetype="application/json" )
    



