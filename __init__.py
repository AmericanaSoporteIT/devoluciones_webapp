import os
from datetime import timedelta
from flask import Flask


def page_not_found(e):
    return render_template('404.html'), 404 


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    #cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
    app.config.from_mapping(
        TESTING = True,
        SECRET_KEY="dev",
        #DATABASE=os.path.join(app.instance_path, "DB.sqlite"),
    )
    app.register_error_handler(404, page_not_found)
    # tiempo de session valida antes de pedir login de nuevo
    #app.permanent_session_lifetime = timedelta(minutes=5)
    
    if test_config is None:
	#cargar configuracion y si no existe iniciar en modo testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.update(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass


    @app.route("/hello")
    def hello():
        return "Hello, World!"
    
    
    hello()

    # register the database commands
    from Application import db
    # local sqlite db
    # db.init_app(app)



    from Application  import (auth, index, 
            user,reset, route,
            customer
        )
    
   
    from Application.refund import refund, refund_api
    from Application.tools import create_report

    from Application.operaciones import clientes, rutas
    from Application.handler_error import errors
    app.register_blueprint(clientes.bp)
    app.register_blueprint(rutas.bp)
    app.register_blueprint(errors.bp)
    #registar namespace en blueprint para usar decoreador 
    app.register_blueprint(auth.bp)
    app.register_blueprint(index.bp)
    app.register_blueprint(refund.bp)
    app.register_blueprint(route.bp)
    app.register_blueprint(customer.bp)
    app.register_blueprint(refund.bp)
    app.register_blueprint(reset.bp)
    app.register_blueprint(create_report.bp)



    
    app.add_url_rule("/", endpoint="index")

    return app