var no_correlativo = document.querySelector("#correlativo");
var empresa = document.querySelector("#cli_empresa");
var fecha_devolucion = document.querySelector("#fecha_devolucion");
var walmart_id = document.querySelector("#id_tienda_walmart");
var cli_cliente = document.querySelector("#input_cli_cliente");
var no_ref =  document.querySelector("#referencia");
var no_lote = document.querySelector("#lote");
var codigo_ruta = document.querySelector("#cli_vendedor");
var nombre_vendedor = document.querySelector("#ven_nombre");
var nombre_cliente = document.querySelector("#cli_nombre");
var nombre_cadena = document.querySelector("#cadena");
var nombre_subcadena = document.querySelector("#tienda");
var lista_precion = document.querySelector("#lista_precio");
var nivel_precio  = document.querySelector("#nivel_precio");
var tipo_ingreso  = document.querySelector("#tipo_ingreso");

no_correlativo.value = dev[0].DINDCH_DEVNUMERO;
switch(dev[0].DINDCH_EMPRESA){
    case 'PAN':
    empresa.selectedIndex = 1
    break;
    case 'PSA':
    empresa.selectedIndex = 0
    break;
}
fecha_devolucion.valueAsDate = FromNumbertoDate(dev[0].DINDCH_FECHA)
cli_cliente.value = dev[0].CLI_CODIGO;
nombre_cliente.value = dev[0].CLI_NOMBRE;
nombre_cadena.value = dev[0].CLC_DESCRIPCION;
nombre_subcadena.value = dev[0].CLA_DESCRIPCION;
no_ref.value = dev[0].DINDCH_NUMRECL;
no_lote.value = dev[0].DINDCH_LOTERECL;
codigo_ruta.value =  dev[0].DINDCH_VENDEDOR;
nombre_vendedor.value = dev[0].VEN_NOMBRE;
lista_precion.value = dev[0].EXT_MONEDA;
nivel_precio.value = dev[0].EXT_NIVPRECIO;

switch(dev[0].DINDCH_TIPINGRESO){
    case 'C':
        tipo_ingreso.selectedIndex = 2;
    break;
    case 'D':
        tipo_ingreso.selectedIndex = 1;
    break;
}

if ( dev.length > 0 ){
    
    
    dev[0].DINDCL_LINEA
    dev[0].DINDCL_INVENTARIO
    dev[0].DINDCL_CANTIDAD 
    dev[0].DINDCL_COSTO
    dev[0].DINDCL_CAUSADEV
    dev[0].DINDCL_COSTOTAL

    dev.forEach(
        el => { 
            console.log(
                el.DINDCL_LINEA + " " 
              + el.DINDCL_INVENTARIO + " "
              + el.DINDCL_CANTIDAD + " "
              + el.DINDCL_COSTO + " "
              + el.DINDCL_CAUSADEV + " "
              + el.DINDCL_COSTOTAL 
            );
        }
    );


    var tbody_detalle = document.querySelector("#tbody_detalle");
    dev.forEach(
        el => {
            var index = el.DINDCL_LINEA-1;
            var tr  = tbody_detalle.insertRow(index);
            var td_no_linea = tr.insertCell(0);
            var td_codigo_producto = tr.insertCell(1);
            var td_descripcion_producto = tr.insertCell(2);
            var td_causadev = tr.insertCell(3);
            var td_cantidad = tr.insertCell(4);
            var td_precio = tr.insertCell(5);
            var td_monto = tr.insertCell(6);

            td_no_linea.innerText               = el.DINDCL_LINEA;
            td_codigo_producto.innerText        = el.DINDCL_INVENTARIO;
            td_descripcion_producto.innerText   = el.INV_NOMBRE;
            td_causadev.innerText               = el.DINDCL_CAUSADEV;
            td_cantidad.innerText               = parseFloat(el.DINDCL_CANTIDAD).toFixed(2);
            td_precio.innerText                 = parseFloat(el.DINDCL_COSTO).toFixed(2);
            td_monto.innerText                  = parseFloat(el.DINDCL_COSTOTAL).toFixed(2);
        }
    ); 
    document.querySelector("#grantotal").innerText = parseFloat(dev[0].DINDCH_TOTAL).toFixed(2);
}



