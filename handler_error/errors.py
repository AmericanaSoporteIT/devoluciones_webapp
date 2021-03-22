from flask import Blueprint
from flask import render_template
from flask import request, Response
from flask  import jsonify
from flask import json 
from Application.auth import login_required
from Application.breadcrumb import breadcrumb



bp = Blueprint('errors', __name__)

@bp.app_errorhandler(404)
def handle_404(err):
    return render_template('404.html'), 404

@bp.app_errorhandler(500)
def handle_500(err):
    return render_template('500.html'), 500