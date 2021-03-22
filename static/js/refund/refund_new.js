var form_devolucion     = document.getElementById("form");
var input_numero        = document.getElementById("numero");
var button_buscar       = document.getElementById("buscar");
var select_vendedor     = document.getElementById("vendedor");
var select_cliente      = document.getElementById("cliente");
var input_fecha_ingreso = document.getElementById("fecha");
var select_concepto     = document.getElementById("concepto");
var input_relacmo       = document.getElementById("reclamo");
var input_lote          = document.getElementById("lote");
var input_fecha_reclamo = document.getElementById("fecha_reclamo");
var tabla_productos     = document.querySelector("#tbody");

var obj_saleman       = new Object();
var list_obj_saleman  = new Object();
var obj_customer      = new Object();
var list_obj_customer = new Object();
var list_obj_products = new Object();

get_list_saleman();

if(window.location.pathname == "/refund/buscar"){
  select_vendedor.focus();
  select_vendedor.addEventListener("change", function(e){
    if(e){
      console.log(this.value);
      fill_element_select_customers(list_obj_customer,select_vendedor.value);
    }
  });
}






