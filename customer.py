import functools
from typing import FrozenSet

from flask import Blueprint
from flask import flash
from flask import g
from flask import redirect
from flask import render_template
from flask import request
from flask import session
from flask import url_for
from flask.wrappers import JSONMixin

from werkzeug.exceptions import abort

from Application.auth import login_required, load_logged_in_user
from Application.breadcrumb import breadcrumb
from Application.connect_server import mssql_connect

from flask import jsonify
from Application.tools.serializer import serializer
from Application.SQL import Table_customer

bp = Blueprint('consult', __name__, url_prefix='/customer')

@bp.route('/' , methods=("GET", "POST"))
@breadcrumb('Clientes')
@login_required
def customer():
    conn = mssql_connect()
    result_customers = None
    if request.method == "POST":
        codigo = request.form["codigo"]
        cliente = request.form["cliente"]
        #checkbox = request.form.getlist("checkbox")
        query = "SELECT  MASTCLI.CLI_EMPRESA, EMPRESA.EMP_NOMBRE, CLI_CODIGO,  CLI_NOMBRE, CLI_NIT, CLI_DIRECCION  FROM MASTCLI INNER JOIN EMPRESA ON MASTCLI.CLI_EMPRESA = EMPRESA.EMP_CODIGO WHERE  "
        not_ph1 = " AND NOT MASTCLI.CLI_EMPRESA ='PH1' ORDER BY MASTCLI.CLI_CODIGO"

        if not codigo:
            buscar_cliente = query + "( MASTCLI.CLI_NOMBRE LIKE ? )" + not_ph1
            result_customers = conn.cursor().execute(
                buscar_cliente,
                (cliente+'%',)
            )
            return render_template('view/customer/customer.html', Clientes=result_customers)
        elif not cliente:
            buscar_cliente = query + "( MASTCLI.CLI_CODIGO LIKE ? )" + not_ph1
            result_customers = conn.cursor().execute(
                buscar_cliente,
                (codigo+'%',)
            )
            return render_template('view/customer/customer.html', Clientes=result_customers)
        else:
            buscar_cliente = query + "( MASTCLI.CLI_CODIGO = ? OR MASTCLI.CLI_NOMBRE = ? )" + not_ph1
            result_customers = conn.cursor().execute(
                buscar_cliente,
                (codigo, cliente,)
            )
            return render_template('view/customer/customer.html', Clientes=result_customers)

        
    return render_template('view/customer/customer.html', Clientes=result_customers)



@bp.route('/api/get/customers')
def list_customer():
    conn = mssql_connect()
    customer = conn.cursor().execute(Table_customer.customers)
    result = serializer(customer)

    return jsonify(result)