import os
from configparser import ConfigParser

class Config:
    section = None
    filename='Application/config/odbc.ini'

    def init(self,section,filename):
        self.section= section
        self.filename = filename
        # create a parser
        parser = ConfigParser()
        # read config file
        parser.read(filename)

        # get section, default to postgresql
        db = {}
        if parser.has_section(section):
            params = parser.items(section)
            for param in params:
                db[param[0]] = param[1]
        else:
            raise Exception('Section {0} not found in the {1} file'.format(section, filename))

        return db


""" if __name__ == "__main__":

    config = Config()
    print (config.init('MYSQL',config.filename)) """