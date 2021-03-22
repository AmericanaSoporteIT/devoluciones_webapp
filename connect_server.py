from __future__ import absolute_import
import pyodbc
from Application.config import Config


#cnxn = pyodbc.connect("DRIVER={SQL Server};SERVER='10.34.1.7';DATABASE='QSYSTEMS';UID='sa';PWD='sql'")


class Connection:
    config = Config()
    section = None
    params = None
    conn = None
    cursor = None

    def __init__(self) -> None:
        super().__init__()

    def mssql(self):
        try:
            section = 'MSSQLSERVER'
            params = self.config.init(section, self.config.filename)
            conn = pyodbc.connect(**params)
            #conn.setdecoding(pyodbc.SQL_CHAR, encoding='CP850')
            conn.setdecoding(pyodbc.SQL_CHAR, encoding='CP1252')
            #conn.setdecoding(pyodbc.SQL_WCHAR, encoding='CP850')
            conn.setdecoding(pyodbc.SQL_WCHAR, encoding='CP1252')
            self.conn = conn
            return self.conn
        except ValueError:
            print(ValueError)

    def cursor(self):
        try:
            conn = self.mssql()
            cur = conn.cursor()
            return cur
        except ValueError:
            print(ValueError)
    
    def close(self):
        return self.conn.close()



conn = None

def mssql_version():
    """ Connect to the MySQL database server """
    conn = None
    try:
        # read connection parameters
        config = Config()
        params = config.init('MSSQLSERVER', config.filename)
        # connect to the MySQL server
        print('Connecting to the MySQL database...')
        conn = pyodbc.connect(**params)
        # create a cursor
        cur = conn.cursor()

	# close the communication with the MSSQL
        cur.close()
    except (Exception, pyodbc.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')

def mysql_version():
    conn = None
    try:
        # read connection parameters
        config = Config()
        params = config.init('MYSQL', config.filename)
        # connect to the MySQL server
        print('Connecting to the MySQL database...')
        conn = pyodbc.connect(**params)		
        # create a cursor
        cur = conn.cursor()        
	    # execute a statement
        print('MySQL database version:')
        cur.execute('SELECT VERSION()')
        # display the MySQL database server version
        db_version = cur.fetchone()
        print(db_version)

	# close the communication with the MySQL
        cur.close()
    except (Exception, pyodbc.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')    


def mssql_connect():
    conn = None
    try:
        config = Config()
        params = config.init('MSSQLSERVER', config.filename)
        conn = pyodbc.connect(**params)
        #conn.setdecoding(pyodbc.SQL_CHAR, encoding='CP850')
        conn.setdecoding(pyodbc.SQL_CHAR, encoding='CP1252')
        #conn.setdecoding(pyodbc.SQL_WCHAR, encoding='CP850')
        conn.setdecoding(pyodbc.SQL_WCHAR, encoding='CP1252')
        #conn.setencoding(encoding='CP850')
        #conn.setencoding(encoding='CP1252')
        return conn
    except (Exception, pyodbc.DatabaseError) as error:
        print(error)
        return error
    finally:
        if conn is not None:
            return conn
        else:
            conn.close()

def mysql_connect():
    conn = None
    try:
        config = Config()
        params = config.init('MYSQL', config.filename)
        conn = pyodbc.connect(**params)
        return conn
    except (Exception, pyodbc.DatabaseError) as error:
        print(error)
        return error
    finally:
        if conn is not None:
            return conn
        else:
            conn.close()


if __name__ == "__main__":
    
    # test_select_mssql()
     conn =mysql_connect()
     query = conn.cursor().execute(
         "SELECT e.nombre, r.ruta, r.nombre, t.descripcion \
            FROM  \
                inf_ruta r \
            JOIN sis_empresa e \
                ON  r.empresa = e.empresa \
            JOIN inf_tipo_ruta t \
                ON r.tipo_ruta = t.tipo_ruta"
     )
     for q in query:
         print (q)

