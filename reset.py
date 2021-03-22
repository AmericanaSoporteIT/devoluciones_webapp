import functools

from flask import Blueprint, templating
from flask import flash
from flask import g
from flask import redirect
from flask import render_template
from flask import request
from flask import session
from flask import url_for
from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash


from Application.breadcrumb import nologin_breadcrumb

bp = Blueprint("auth/resetpass", __name__, url_prefix="/auth/resetpass")

@bp.route("/dashboard")
@nologin_breadcrumb("Dashboard")
def dashboard():
    return render_template("dashboard/index.html")


