    # conn = mysql_connect()
    # empresa = conn.cursor().execute('SELECT nombre,qsys_empresa FROM sis_empresa;')
    # ruta = conn.cursor().execute('SELECT e.nombre as empresa, r.ruta, r.nombre, t.descripcion FROM inf_ruta r JOIN sis_empresa e on  r.empresa = e.empresa JOIN inf_tipo_ruta t on r.tipo_ruta = t.tipo_ruta limit 5' )
    

import functools

from flask import Blueprint
from flask import flash
from flask import g
from flask import redirect
from flask import render_template
from flask import request
from flask import session
from flask import url_for
from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash

from Application.auth import login_required, load_logged_in_user
from Application.breadcrumb import breadcrumb

from Application.connect_server import mssql_connect

bp = Blueprint('route', __name__, url_prefix='/route')


# import pyodbc 
# from Application.config import Config

@bp.route('/')
@login_required
@breadcrumb('Ruta')
def route():
    return render_template('form/route/route.html')

@bp.route('/info')
@login_required
@breadcrumb('Informacion Vendedores')
def route_info():
    conn = mssql_connect()
    empresa = conn.cursor().execute("SELECT distinct VEN_EMPRESA FROM QSYSTEMS.dbo.VENDEDOR WHERE VEN_EMPRESA='PAN';")
    conn = mssql_connect()
    vendedor = conn.cursor().execute("SELECT * FROM QSYSTEMS.dbo.VENDEDOR WHERE VEN_EMPRESA='PAN' AND VEN_CODIGO<900 ORDER BY VEN_CODIGO ASC;")
    return render_template('form/route/info.html', Empresas=empresa, Vendedores=vendedor)