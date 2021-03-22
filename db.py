import click
import sqlite3
from flask import current_app
from flask import g
from flask.cli import with_appcontext

from Application.connect_server import mssql_connect

def get_db():
    if "db" not in g:
        g.db = mssql_connect()
    return g.db

# def get_db():
#     if "db" not in g:
#         g.db = sqlite3.connect(
#             current_app.config["DATABASE"], detect_types=sqlite3.PARSE_DECLTYPES
#         )
#         g.db.row_factory = sqlite3.Row
#     return g.db

# def close_db(e=None):
#     db = g.pop("db", None)
#     if db is not None:
#         db.close()

# def init_db():
#     db = get_db()
#     with current_app.open_resource("schema.sql") as f:
#         db.executescript(f.read().decode("utf8"))

        


# @click.command("init-db")
# @with_appcontext
# def init_db_command():
#     init_db()
#     click.echo("Initialized the database.")


# def init_app(app):

#     app.teardown_appcontext(close_db)
#     app.cli.add_command(init_db_command)



def get_row_by_name(cursor):
    data = cursor.fetchall()
    result = []
    column_name = [column[0] for column in cursor.description]
    for row in data:
        result.append(
            dict(
                zip ( column_name, row)
            )
        )
    return result
