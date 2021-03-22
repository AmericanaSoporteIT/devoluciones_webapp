from flask import Blueprint
from flask import flash
from flask import g
from flask import redirect
from flask import render_template
from flask import request
from flask import url_for
from werkzeug.exceptions import abort

from Application.auth import login_required
#from Application.db import get_db
from Application.breadcrumb import breadcrumb



bp = Blueprint("index", __name__)


@bp.route("/")
@login_required
@breadcrumb('Inicio')
def index():
    '''Show all the posts, most recent first.
    db = get_db()
    users = db.execute("SELECT * FROM user;")
    
    posts = db.execute(
        "SELECT p.id, title, body, created, author_id, username"
        " FROM post p JOIN user u ON p.author_id = u.id"
        " ORDER BY created DESC"
    ).fetchall()
    '''
    users=""
    return render_template("index.html", users=users)

@bp.route('/login')
def login():
    return render_template('auth/login.html')


@bp.route('/test')
def test():
    return render_template('test.html')

