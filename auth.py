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


#from Application.db import get_db
#from Application.user import get_user
from Application.breadcrumb import breadcrumb

from Application.connect_server import mssql_connect
from Application.tools.serializer import serializer



bp = Blueprint("auth", __name__, url_prefix="/auth")

SELECT_USUARIOS = "SELECT USER_EMPRESA, RTRIM(USER_USUARIO) AS USER_USUARIO, RTRIM(USER_PASSWORD) AS USER_PASSWORD,  RTRIM(USER_NOMBRE) AS USER_NOMBRE FROM USUARIOS  "

def login_required(view):
    """View decorator that redirects anonymous users to the login page."""

    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for("auth.login"))

        return view(**kwargs)

    return wrapped_view


@bp.before_app_request
def load_logged_in_user():
    """If a user id is stored in the session, load the user object from
    the database into ``g.user``."""
    user_id = session.get("user_id")
    user_empresa = session.get("empresa")

    if user_id is None:
        g.user = None
    else:
        conn = mssql_connect()
        users = conn.cursor().execute( SELECT_USUARIOS + "  WHERE  USER_NOMBRE = ? ", (user_id,)).fetchone()
        g.user = users
        g.empresa = user_empresa
        g.empresa_codigo = 'PAN'
        
    
    
     

@bp.route("/register", methods=("GET", "POST"))
@breadcrumb('Registro de Usuarios')
@login_required
def register():
    users = None
    query = mssql_connect()
    users = query.cursor().execute(SELECT_USUARIOS)
    if request.method == "POST":
        username = request.form["username"]
        email = request.form["email"]
        password = request.form["password"]
        is_admin = request.form.get("is_admin")
        error = None

        if not username:
            error = "Usuario es Requerido."
        elif not password:
            error = "Clave es Requerido."
        elif not is_admin:
            is_admin = None
        elif (
            query.cursor().execute( SELECT_USUARIOS + "  WHERE USER_NOMBRE = ? ", (username,)).fetchone()
            is not None
        ):
            error = "User {0} is already registered.".format(username)

        if error is None:
            query.cursor().execute(
                "INSERT INTO user (username, email, password, is_admin) VALUES (?, ?, ?, ?)",
                (username, email, password,is_admin),
            )
            query.cursor().commit()
            flash(error)
            return redirect(url_for("auth.register"))
        
    return render_template("auth/form/user.html", Users=users )

@bp.route("/resetpass")
@breadcrumb('Reiniciar Password')
@login_required
def resetpass():
    return render_template('auth/reset.html')

@bp.route("/login", methods=("GET", "POST"))
def login():
    error = None
    """Log in a registered user by adding the user id to the session."""
    con = mssql_connect()
    empresas = con.cursor().execute(
        "SELECT \
            EMP_CODIGO, RTRIM(EMP_NOMBRE)AS EMP_NOMBRE \
            FROM EMPRESA \
        WHERE \
            NOT EMP_CODIGO='CER' AND \
            NOT EMP_CODIGO='CUD' AND \
            NOT EMP_CODIGO='PH1' AND \
            NOT EMP_CODIGO='RIB' AND \
            NOT EMP_CODIGO='SEG' \
            ORDER BY EMP_NOMBRE ASC"
        ).fetchall()
    
    if request.method == "POST":
        empresa = request.form.get("empresa")
        usuario = request.form["usuario"]
        clave = request.form["clave"]
        empresa = empresa.split("|")

        db = mssql_connect()
        error = None
        user = db.cursor().execute( SELECT_USUARIOS + " WHERE USER_USUARIO = ?  AND USER_EMPRESA = ?", (usuario,empresa[0])).fetchone()
    
        if user is None:
            error = "Incorrecto Usuario."
            session.clear()
            # field USER_USUARIO lenght = 15  fill with  'clave          ' -->   clave+((15-len(clave))*' ')
        elif clave != user[2]:
            error = "Incorrect Clave. {0}".format(user[1])
            session.clear()
        if error is None:
            # store the user id in a new session and return to the index
            session.clear()
            session["empresa"] = empresa[1]
            session["user_id"] = user[3].strip()
            return redirect(url_for("index"))
            
        flash(error)
        

    return render_template("auth/login.html",Error=error, Empresas=empresas)


@bp.route("/logout")
def logout():
    """Clear the current session, including the stored user id."""
    session.clear()
    return redirect(url_for("index"))


