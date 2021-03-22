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

bp = Blueprint('repayment', __name__, url_prefix='/repayment')

@bp.route('/')
@breadcrumb('Devoluciones')
@login_required
def repayment():
    return render_template('formulario/repayment/repayment.html')

@bp.route('/new')
@breadcrumb('Devoluciones / Nuevo Registro')
@login_required
def repayment_new():
    return render_template('formulario/repayment/repayment.html')

@bp.route('/buscar', methods=('GET', 'POST'))
@breadcrumb('Buscar Devoluciones')
@login_required
def repayment_search():
    return render_template('fomularios/repayment_search.html')


