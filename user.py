import functools

from flask import Blueprint
from flask import flash
from flask import g
from flask import redirect
from flask import render_template
from flask import request
from flask import session
from flask import url_for

from werkzeug.exceptions import abort

from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash


#from Application.db import get_db

def get_user(id, is_admin=True):
    user = (
    #     get_db()
    #     .execute(
    #         "SELECT *"
    #         " FROM user"
    #         " WHERE id = ?",
    #         (id,),
    #     )
    #     .fetchone()
    )

    if user is None:
        abort(404, f"Usuario id {id} doesn't exist.")

    if is_admin and user["is_admin"] != g.user["id"]:
        abort(403)

    return user
