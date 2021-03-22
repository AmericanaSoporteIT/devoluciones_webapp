class Producto:
    index = None
    code = None
    name = None
    qty = None
    def __init__(self) -> None:
        super().__init__()

    def get_index(self):
        return self.index

    def get_code(self):
        return self.code

    def get_name(self):
        return self.name

    def get_qty(self):
        return self.qty