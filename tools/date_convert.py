### sphinx-apidoc -o docs . -f -F -H .Application -A "Devoluciones" -V 0.0.1 -R 0.0.1
"""
Modulo date_convert
Para conversion de de Fecha y hora a tipo integer
estilo sqlserver: 
    Fehca:
        "SELECT CONVERT(DATETIME,(CONVERT (INT,43912)))"  => '2020-03-24 00:00:00.000'
        "SELECT CONVERT(INT,(CONVERT (DATETIME,'2020-03-24 00:00:00.000')))" => 43912
    Hora:



"""
from datetime import datetime
import time
import re

class Date:
    """
        clase Date
        crea una instacia de si misma
    """
    """:param offset = la cantidad de dias transcurridos desde la fecha 1900-01-01 hasta la fecha actual
    """
    offset =  datetime(1900, 1, 1).toordinal()
    """
        :param: current_now determinal la fecha en el instante (ahora).
    """    
    current_now = datetime.now()
    """:param carvert sera el valor que retornara el metodo despues de calcular los dias transcurridos 
    """
    date = None
    convert = None

    def __init__(self) -> None:
        """
            Constructor de objeto Date
        """
        super().__init__()

        
    def new_format(self,_str, _format, _new_format):
        return datetime.strptime(_str, _format).strftime(_new_format)

    def from_ordinal(self, number_ordinal: int ) -> int:
        """
            method from_ordinal  recibe como parametro un numero desde logitud 5 que serian la cantidad de dias trancurrdios desde 1900-01-01 + el parametro offset
            para ser convertido a un objeto tipo datetime
            :param: number_ordinal El Int que desea convertir a fecha standar tipo "YYYY-mm-dd" 
        """
        date = datetime.fromordinal( number_ordinal + self.offset)
        return date

    def to_ordinal(self,date_to_convert:str) -> str:
        """ to_ordinal  
            :param: date_to_convert recibe un string de la fecha estipo "Y/M/D"  o "D/M/Y"
        """
        
        """validar fecha con una exprsion regular  en formato Y/M/D
           re.search(r"[0-9]{2,4}/[0-9]{1,2}/[0-9]{1,2}", "2000/2/02")"""
        pattern_YMD = r"[0-9]{2,4}-[0-9]{1,2}-[0-9]{1,2}"
        """validar fecha con una exprsion regular  en formato D/M/Y 
           re.search(r"[0-9]{1,2}/[0-9]{1,2}/[0-9]{2,4}", "02/2/2020")
        """
        pattern_DMY = r"[0-9]{1,2}/[0-9]{1,2}/[0-9]{2,4}"
        
        match_date = None
        """usarmos la funcion re para validar expresion y buscamos el patron en una cade tipo str re.search(PATRON, CADENA_A_EVALUAR)"""
        match_date =re.search(pattern_YMD, date_to_convert)

        """Si existe un resultado del patron("2020-01-01") en la cadena entonces """  
        if match_date:
            """convertimos el patron en un grupo y hacemos una separacion por "-" y guardamos el resultado en f que nos da un array de longitud 3 """
            f = match_date.group(0).split("-")
            """crearemos un instancia de tipo datetime que recibira como parametro la resta de dos  datetime convertidas a digitos con el metodo toordinal 
               que seria fecha - offset  = dias transcurrdios
            """
            convert = datetime.fromordinal(datetime.toordinal(datetime(int(f[0]), int(f[1]), int(f[2]) ) )  - self.offset ).toordinal()
        
        else:
            """ de lo contrario si la fecha es de formato es de tipo "31/05/2020"  hacemos la comprobacion con expresion regular  D/M/YYYY """
            match_date = re.search(pattern_DMY, date_to_convert)
            """ separamos el resultado de la expresion por separado "/" y loguardamos en f que es un array longutid 3 """
            f = match_date.group(0).split("/")
            """ Creamos una instacia de tipo datieme y le pasamos los parametros de la fecha que es f[]  y le restamos el offset 
                y con la funcion  formordinal convertimos a una fecha que standar y retornamos como convert
             """
            convert = datetime.fromordinal(datetime.toordinal(datetime(int(f[2]), int(f[1]), int(f[0]) ) )  - self.offset ).toordinal()
          
        return convert

class Time:
    """el atributo current_now obtiene la fecha actual del sistema y la almacena"""
    current_now = datetime.now()
    """atributo date nos servira para hacer calculos temporales y almacenaje """
    date = None
    """el attributo convert es el valor a retornar de los metodos from_ordinal y to_ordinal """
    convert = None
    time_now = datetime.now().strftime("%H:%M:%S")

    def __init__(self) -> None:
        """constructor de instancia con parametos Nulos"""
        super().__init__()
    
    def from_ordinal(self, number_ordinal: int) -> int:
        """from_ordinal es convertir una fecha que esta en tipo INT a tipo ISO 8601"""
        # creamos el dia, 
        now = datetime.now().strftime("%Y-%m-%d")
        # asignamos el dia y la hora 00:00:00 y obtenemos una tupla
        date = datetime.timetuple(datetime.strptime(now, "%Y-%m-%d"))
        di = datetime(date.tm_year, date.tm_mon, date.tm_mday, date.tm_hour, date.tm_min, date.tm_sec)
        # multiplicamos el entero por 0.864 y le sumamos la direfencia en milisegundos desde dia actual mas la hora 00:00:00
        df = number_ordinal * 0.864 + datetime.timestamp(di)
        convert = datetime.fromtimestamp(df)
        # format strftime =  %X = 10:03:04  ,   %f = miliseconds    
        return datetime.strftime(convert, "%X.%f")

    def to_ordinal(self,date_to_convert: str) -> str:
        """from_ordinal es convertir una fecha que esta en tipo ISO 8601 a tipo INT """
        # regex para hora tipo 23:59:59
        pattern_time_h_m_s = r"^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$" 
        # regex para hora tipo 23:59:59.999
        pattern_time_h_m_s_ms = r"^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9]).([0-9]?[0-9]?[0-9])$"
        date = offset = datetime
        convert = None
        try:
            match = re.match(pattern_time_h_m_s, date_to_convert)
            if match:
                today = datetime.now().strftime("%Y-%m-%d")
                init_time = today +" 00:00:00" 
                today_time = today +" "+ date_to_convert
                date = datetime.strptime(today_time,"%Y-%m-%d %X")
                offset = datetime.strptime(init_time,"%Y-%m-%d %X")
            else:
                try:
                    match = re.match(pattern_time_h_m_s_ms, date_to_convert)
                    today = datetime.now().strftime("%Y-%m-%d")
                    init_time = today +" 00:00:00.000" 
                    today_time = today +" "+ date_to_convert
                    date = datetime.strptime(today_time,"%Y-%m-%d %X.%f")
                    offset = datetime.strptime(init_time,"%Y-%m-%d %X.%f")
                except ValueError as err:
                    print ("Error {0}".format(err))

            df = time.mktime(date.timetuple())
            di = time.mktime(offset.timetuple()) 
            convert = round(((df - di) / 0.864))        

        except ValueError as err:
            print ("Error {0}".format(err))

        return convert

# if __name__ == "__main__":
#     date_iso8601 = "2/1/2020"
#     date_number = 16983
#     d = Date()
#     o = d.to_ordinal(date_iso8601)

#     print ("date: {0},  {1}".format(date_iso8601, o))
#     convert = d.from_ordinal(date_number)
#     print ("from ordinal {0},  date: {1}".format(date_number,convert.strftime("%d/%m/%Y")))

