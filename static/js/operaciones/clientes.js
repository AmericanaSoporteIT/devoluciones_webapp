var select_cli_empresa = document.querySelector("#cli_empresa");
var input_fecha_devolucion = document.querySelector("#fecha_devolucion")
var input_cli_codigo = document.querySelector("#input_cli_cliente");
var cliente = new Object();
var select_causa = document.querySelector("#causa");
var input_ruta = document.querySelector("#cli_vendedor");
var input_vendedor = document.querySelector("#ven_nombre");
var input_cli_nombre = document.querySelector("#cli_nombre");
var input_cadena = document.querySelector("#cadena");
var input_tienda = document.querySelector("#tienda");
var active_element = document.activeElement;
var btn_modal_aceptar = document.querySelector("#modal_cliente_opcion");
var input_referencia = document.querySelector("#referencia");
var select_tipo_ingreso = document.querySelector("#tipo_ingreso");
var producto = new Object();
var gln_walmart = new Object()
var datos_consulta = new Object();
var datos_producto = null;
var input_inv_inventario = document.querySelector("#inv_inventario")

var input_lista_precio = document.querySelector("#lista_precio");
var input_nivel_precio = document.querySelector("#nivel_precio");

var detalle = new Array();
var tbody_cliente = document.querySelector("#tbody_clientes");
var input_EXT_EXTRA6 = document.querySelector("#EXT_EXTRA6");
var input_EXT_EXTRA7 = document.querySelector("#EXT_EXTRA7");


/**
 * funciones de fecha
 */
var doc = window.document;
doc.addEventListener("change", function(e){ 
   if (e){ 
      var now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      document.querySelector("#date_create").value = now.toISOString().slice(0,19);
   }  
});

/**
 * buscar por id de walmart
 * 
 */

var input_id_tienda_walmart = document.querySelector("#id_tienda_walmart");

input_id_tienda_walmart.addEventListener('keydown',function(e){
   if((e.keyCode == 9 || e.keyCode == 13 || e.keyCode == 32 ) && input_id_tienda_walmart.value !=""){
      console.log("id walmart ", input_id_tienda_walmart.value);
      fetch(window.location.origin+"/operaciones/get/tiendawallmart/"+input_id_tienda_walmart.value) //input_cli_codigo.value)
      .then(function(response_refund){
         return response_refund.json();
      }).then(function(json_response_refund){
         gln_walmart = json_response_refund;
      if(gln_walmart.length >= 1){
         console.log(gln_walmart);
         input_cli_codigo.value = gln_walmart[0].CGPS_CLIENTE;
         button_buscar_cliente.click();
         input_cli_codigo.focus();
      }
      else if(e.keyCode == 27){

      } 
      else{
         modal_alert("Codigo de Tienda Walmart",
         `* No Existe, o No esta registrado\n`, input_id_tienda_walmart);
      }
      });
      
   }
});

/**
  * fin de funciones fecha
  **/

/**
 * funciones de Cliente
 **/

input_cli_codigo.addEventListener('keydown', function(e){ 
   // //if(e.keyCode == 46 || e.keyCode == 27 || e.keyCode == 8){

   if(e.keyCode == 9 || e.keyCode == 13 || e.keyCode == 32){
   //if(e && input_cli_codigo.value.length>=2){
      //console.log("activo if codiog 46 | 27")
      clean_input_cliente(); 
      exites_cliente= buscar_cliente(input_cli_codigo.value);

      if (cliente.length >=1){         
         console.log("ok, existe");
      }
      else if(cliente.length == 0 ) {
         console.log("no exite");
         clean_input_cliente();
      }
   }
   else if (e.keyCode == 13 || e.keyCode == 9){
      console.log("activo if codiog 13")
   }
});

input_referencia.addEventListener("click", function(e){
   if(input_cli_codigo !=""){
      buscar_cliente(input_cli_codigo.value);   
   }
});
input_referencia.addEventListener("keydown", function(e){
   if(e.keyCode == 9 || e.keyCode == 13 || e.keyCode == 32){
      if(input_referencia.value !=""){
         busqueda= input_referencia.value
         var ref = new Object();
         fetch(window.location.origin+"/operaciones/get/ref/"+ busqueda)
         .then(function(response){
            if(response.status == 200){
               return response.json();
            }else{
               modal_alert("Problema Al buscar la Refencia",
               response.statusText, input_referencia);   
            }      
         }).then(function(json_response){
            ref = json_response;
            console.log(ref);
         if(ref.length >= 1){
            modal_alert("Problema Refencia Duplicada",
            "El Codigo de Refencia Ya fue Registrado en: <p>"
            +" Registro: <b>"+ref[0].DINDCH_DEVNUMERO+"</b> "
            +" Cliente: <b>"+ref[0].DINDCH_CLICODIGO+"</b> "
            +" Fecha: <b>"+FromNumbertoDate(ref[0].DINDCH_FECHA).toLocaleDateString()+"</b></p> "
            , input_referencia);
         }
         });
      
      }
   }
   console.log("press: ", e.keyCode)

});


function buscar_cliente(cli_cliente){
   //comprobamos que no enviamos un codigo vacio o nulo
   
   if(input_cli_codigo.value != ""){
      fetch(window.location.origin+"/operaciones/get/cliente/"+cli_cliente)
      .then(function(response_refund){
         return response_refund.json();
      }).then(function(json_response_refund){
       cliente = json_response_refund;
      if(cliente.length >= 1){
           input_ruta.value = cliente[0].CLI_VENDEDOR;
           input_vendedor.value = cliente[0].VEN_NOMBRE;
           input_cli_nombre.value = cliente[0].CLI_NOMBRE;
           input_cadena.value = cliente[0].CADENA;
           input_tienda.value = cliente[0].TIENDA;
           input_lista_precio.value = cliente[0].EXT_MONEDA;
           input_nivel_precio.value = cliente[0].EXT_NIVPRECIO;
           input_id_tienda_walmart.value = cliente[0].CGPS_COD;
           input_EXT_EXTRA6.value = cliente[0].EXT_EXTRA6
           input_EXT_EXTRA7.value = cliente[0].EXT_EXTRA7
          /*
               definier empresa por codigo de cliente
               pattron /[s]|[s][0-9]+/
               string s795   o  S79
           */
           var es_cliente_de_la_individual;
           es_cliente_de_la_individual = cli_cliente.match(/[s]|[S][0-9]+/g)
           if (es_cliente_de_la_individual == null){
              select_cli_empresa.selectedIndex = 1;
           }
           else{
            select_cli_empresa.selectedIndex = 0
           }
            //cambiar tipo input referencia añadir mascara para clientes walmart
            if(cliente[0].CADENA == 'OPERADORA DE TIENDAS, S.A.'){
               var input_referencia = document.querySelector("#referencia");
               var patron  = new Inputmask("99-9999-9999");
               patron.mask(input_referencia);
               document.querySelector("#tipo_devolucion > input").click()
               
            }
            else{
               var input_referencia = document.querySelector("#referencia");
               input_referencia.remove();
               var ref_sitio = document.querySelector("#numero_ref_parent")//document.querySelector("body > main > div > div:nth-child(1) > div:nth-child(4) > div > label:nth-child(5)");
               ref_sitio.innerHTML +='<input type="text" id="referencia" name="" class="form-control form-control-sm">'
               if(cliente[0].CADENA == 'UNISUPER, S.A.'){
                  document.querySelector("#tipo_vale > input").click()
               }
               else{
                  document.querySelector("#tipo_cambio > input").click()
               }
            }
           
           console.log(cliente);
         }
         else{
            /**
             * si el codigo es incorrecto lanzar la ventana de alerta
             */
            modal_alert("No existe Cliente", 
            `El cliente no pertenece a clientes Directos 
            o No existe el codigo de cliente`, input_cli_codigo);

         }

      });
   }

}

function clean_input_cliente(){
   input_ruta.value = "";
   input_vendedor.value = "";
   input_cli_nombre.value = "";
   input_cadena.value = "";
   input_tienda.value = "";
   input_fecha_devolucion = "";
   document.querySelector("#id_tienda_walmart").value =""
}

/**
 * FIN funciones de Cliente
 */


/**
 * Funciones de productos 
 */
var input_cantidad = document.querySelector("#cantidad");
var input_costo = document.querySelector("#costo");
var input_precio = document.querySelector("#precio");
var input_inv_nombre = document.querySelector("#inv_nombre")
var button_agregar = document.querySelector("#agregar")

var tbody = document.querySelector("body > main > div > div:nth-child(2) > div.form-group.border.p-2 > div > div > div > table > tbody");
var temp_producto;
// var comprobar_producto =  document.querySelector("#comprabar_producto");

// comprobar_producto.addEventListener("click", function(e){

// });


input_inv_inventario.addEventListener('keydown', function(e){
   // //if(e.keyCode == 46 || e.keyCode == 27 || e.keyCode == 8){

   if(e.keyCode == 9 || e.keyCode == 13 || e.keyCode == 32){
      clean_input_producto(); 
      //codigo producto, cliente -> lista precio, empresa      
      datos_producto = input_inv_inventario.value+
      ',' + input_cli_codigo.value +
      ',' + select_cli_empresa.value;
      if(input_cli_codigo.value != "" && input_inv_inventario.value !=""){
         var input_lote = document.querySelector("#lote");
         if(input_cadena.value =="OPERADORA DE TIENDAS, S.A." && input_lote.value !=""){
            exites_producto = buscar_producto(datos_producto);
            console.log(exites_producto)
            if (producto.length >=1){         
               console.log("ok, existe");
            }
            else if(producto.length == 0 ) {
               console.log("no exite");
               clean_input_producto();
            }   
         }
         else if(input_cadena.value=="OPERADORA DE TIENDAS, S.A." && input_lote.value ==""){
            modal_alert("Campo Lote","Falta el Numero de Lote del reclamo de walmart", input_lote);
         }
         else{
            exites_producto = buscar_producto(datos_producto);

            if (producto.length >=1){         
               console.log("ok, existe");
            }
            else if(producto.length == 0 ) {
               console.log("no exite");
               clean_input_producto();
               }   
         }
      }
      else if(input_cli_codigo.value ==""){
         modal_alert("Falta Codigo de cliente", 
         "No se ha ingresado el codigo del Cliente\n"
         +"para buscar en lista de precios", input_cli_codigo);
      }
      else if(input_inv_inventario.value == ""){
         modal_alert("Codigo de Prodcuto Vacio", 
         "Ingrese un Codigo de Producto",input_inv_inventario);
         
      }
   }
   
   else if (e.keyCode == 13 || e.keyCode == 9){
      console.log("activo if codiog 13");
   }
}); 

 



function clean_input_producto(){
   input_cantidad.value = "";
   input_precio.value = "";
   input_costo.value = "";

}
button_agregar.addEventListener("click", function(e){
   datos_producto = input_inv_inventario.value+
   ',' + input_cli_codigo.value +
   ',' + select_cli_empresa.value;
   
   if(input_inv_inventario.value != "" && datos_producto.split(",")[0].toUpperCase() == input_inv_inventario.value.toUpperCase() ){
      exites_producto = buscar_producto(datos_producto);
   }
   

   if(e  && input_inv_inventario.value!="" && datos_producto.split(",")[0].toUpperCase() == input_inv_inventario.value.toUpperCase() && input_cantidad.value !=0){
      
      if(producto.length >=1 ){
         var list_producto = document.getElementsByName("cell_producto");
         var codigo_duplicado = undefined;
         var index_lista = 0
         for (index_lista = 0; index_lista< list_producto.length; index_lista++){
            if (list_producto[index_lista].innerText == input_inv_inventario.value){
               modal_alert("Producto Duplicado",
                "El Producto Ya existe en la Lista en la linea "+(index_lista+1) 
                +",\n No se puede Agregar dos Veces", list_producto[index_lista]);
               return codigo_duplicado = true;
            }
         }
         
         if (input_inv_inventario.value !="" && input_cantidad.value != 0 && input_inv_inventario.value.toUpperCase() == producto[0].OTR_INVENTARIO){
   
            var size_table =tbody.childElementCount
            var col_count = tbody.childElementCount+1
            var tr = tbody.insertRow(size_table);
            var btn_edit = document.createElement("button");
            var btn_term = document.createElement("button");
            var btn_delete = document.createElement("button");
            //creacion de elemento
            var td_col_numero = tr.insertCell(0);
            var td_inv_inventario = tr.insertCell(1);
            var td_inv_nombre = tr.insertCell(2);
            var td_causa = tr.insertCell(3)
            var td_cantidad = tr.insertCell(4);
            var td_inv_valor = tr.insertCell(5);
            var td_monto = tr.insertCell(6);
            var tb_button_edit = tr.insertCell(7);         
            var td_button_delete = tr.insertCell(8);
            
            //agregar propiedades
            td_col_numero.setAttribute("name", "cell_number");
            
            td_inv_inventario.setAttribute("id", size_table);
            td_inv_inventario.setAttribute("name", "cell_producto");
            
            td_inv_nombre.setAttribute("id", "producto_"+size_table);
            td_inv_nombre.setAttribute("name", "cell_descripcion");
            
            td_causa.setAttribute("id","causa"+size_table);
            td_causa.setAttribute("name","cell_causa");
            
            td_cantidad.setAttribute("name", "cell_cantidad");
            // td_cantidad.setAttribute("class", "text-right");
            td_cantidad.setAttribute("style", "width:100%;");
   
            td_inv_valor.setAttribute("name", "cell_valor");
            // td_inv_valor.setAttribute("class", "text-right");
            td_inv_valor.setAttribute("style", "width:100%;");
            
            td_monto.setAttribute("id", "monto_"+(size_table))
            td_monto.setAttribute("name", "cell_monto");
            td_monto.setAttribute("class", "text-right");
            td_monto.setAttribute("style", "width:100%;");
           
            btn_edit.setAttribute("id", "btn-tern-"+(size_table));
            btn_edit.setAttribute("name", "editar");
            btn_edit.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
          </svg>`;
            btn_edit.setAttribute("class", "btn btn-info btn-sm");
   
            btn_term.setAttribute("id", "btn-tern-"+(size_table));
            btn_term.setAttribute("name", "terminar");
            btn_term.setAttribute("hidden", "true");
            btn_term.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-square" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
            <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/>
          </svg>`;
            btn_term.setAttribute("class", "btn btn-success btn-sm");
   
            btn_delete.setAttribute("id", "btn-delete"+(size_table))
            btn_delete.setAttribute("name", "quitar");
            btn_delete.setAttribute("class", "btn btn-danger btn-sm")
            btn_delete.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
          </svg>`
   
            //agregar contenido al elemento
            td_col_numero.innerHTML = (col_count);
            td_inv_inventario.innerHTML = input_inv_inventario.value;
            td_inv_nombre.innerHTML = input_inv_nombre.value;
            td_causa.innerHTML = (select_causa[select_causa.selectedIndex].innerHTML).split(" - ")[1];
            td_cantidad.innerHTML = parseFloat(input_cantidad.value).toFixed(2);
            td_inv_valor.innerHTML =  parseFloat(input_precio.value).toFixed(2);
            td_monto.innerHTML = (parseFloat(input_precio.value) * parseFloat(input_cantidad.value)).toFixed(2);
            tb_button_edit.appendChild(btn_edit);
            tb_button_edit.appendChild(btn_term);
            td_button_delete.appendChild(btn_delete);
            
   
            /*
             * sumatoria de columna monto  
             */
   
            var subt = document.getElementsByName("monto");
            var grantotal = 0
            
            for (index =0; index<(subt.length); index++){
               grantotal+=parseFloat(subt[index].innerText);
            }
            
            document.querySelector("#grantotal").innerText = grantotal.toFixed(2);
            // btn_deltee. Quitar
            //agragamos evento click a boton quitar
            if(document.getElementsByName("quitar")){
               var btn_delete = document.getElementsByName("quitar");
               
               btn_delete.forEach(el => el.addEventListener('click', 
                  function(e){
                     el.parentElement.parentElement.remove();
                     var count_row = document.querySelector("#tbody_detalle").childElementCount
                     for (index =0; index<count_row; index++){
                        document.querySelectorAll("#tbody_detalle > tr")[index].querySelector("td").innerText = index+1   
                     }
                     sumar_total();
                  }
               ));
   
               
            }
            if(document.getElementsByName("editar")){
               var btn_editar = document.getElementsByName("editar");
               var btn_terninar = document.getElementsByName("terminar");
               
               btn_editar.forEach(el => el.addEventListener('click', 
                  function(e){
                     console.log(parseInt(el.parentElement.parentElement.getElementsByTagName("td")[0].innerText) - 1)
                     btn_edit.setAttribute("hidden","true");
                     btn_terninar[parseInt(el.parentElement.parentElement.getElementsByTagName("td")[0].innerText) - 1].removeAttribute("hidden");
                     el.parentElement.parentElement.getElementsByTagName("td")[4].classList.add("btn","btn-outline-info");
                     el.parentElement.parentElement.getElementsByTagName("td")[4].setAttribute("contenteditable", "true");
                     el.parentElement.parentElement.getElementsByTagName("td")[5].classList.add("btn","btn-outline-info");
                     el.parentElement.parentElement.getElementsByTagName("td")[5].setAttribute("contenteditable", "true");
                     //el.parentElement.parentElement.getElementsByTagName("td")[6].classList.add("btn","btn-outline-info");
                     //el.parentElement.parentElement.getElementsByTagName("td")[6].setAttribute("contenteditable", "true");
   
                  }
               ));
               
            }
            if(document.getElementsByName("terminar")){
               var btn_editar = document.getElementsByName("editar");
               var btn_terninar = document.getElementsByName("terminar");
               btn_terninar.forEach(el => el.addEventListener("click", 
               function(e){                  
                     btn_edit.removeAttribute("hidden");
                     btn_terninar[parseInt(el.parentElement.parentElement.getElementsByTagName("td")[0].innerText) - 1].setAttribute("hidden", "true");
                     el.parentElement.parentElement.getElementsByTagName("td")[4].classList.remove("btn","btn-outline-info");
                     el.parentElement.parentElement.getElementsByTagName("td")[4].removeAttribute("contenteditable", "true");
                     el.parentElement.parentElement.getElementsByTagName("td")[5].classList.remove("btn","btn-outline-info");
                     el.parentElement.parentElement.getElementsByTagName("td")[5].removeAttribute("contenteditable", "true");
                     //el.parentElement.parentElement.getElementsByTagName("td")[6].classList.remove("btn","btn-outline-info");
                     //el.parentElement.parentElement.getElementsByTagName("td")[6].removeAttribute("contenteditable", "true");
                     var nueva_cantidad = el.parentElement.parentElement.getElementsByTagName("td")[4]
                     var nuevo_valor = el.parentElement.parentElement.getElementsByTagName("td")[5]
                     var nuevo_monto = parseFloat(nueva_cantidad.innerText).toFixed(2) * parseFloat(nuevo_valor.innerText).toFixed(2);
                     
                     el.parentElement.parentElement.getElementsByTagName("td")[6].innerText = nuevo_monto.toFixed(2);
                     el.parentElement.parentElement.getElementsByTagName("td")[4].innerText = parseFloat(nueva_cantidad.innerText).toFixed(2)
                     el.parentElement.parentElement.getElementsByTagName("td")[5].innerText = parseFloat(nuevo_valor.innerText).toFixed(2)
   
                     sumar_total();
               }));   
      
                  
            }
   
            clean_input_producto();
            document.querySelector("#inv_inventario").value ="";
            document.querySelector("#inv_inventario").focus();
            sumar_total();
         }

      }
      else if(input_inv_inventario.value== ""){
         modal_alert("Hay Campos Incompletos", 
         `El campo de Cantidad esta vacio.\n`
         +`No se puede agregar linea sin cantidad`, input_cantidad)
         if(document.querySelector("#fecha_devolucion").value != ""){
            modal_alert("Hay Campos Incompletos", 
            `El campo de Codigo de Producto esta Vacio\n o el campo fecha esta incompleto`, input_fecha_devolucion);
         }
      }
      else if(input_inv_inventario.value =="" || input_inv_inventario.value == 0){
         modal_alert("Campo Cantidad esta Vacio", "Ingrese una Cantidad Superior 0", input_cantidad);
      }
//      buscar_producto(datos_producto);
      sumar_total();
   }

   producto = new Object();
   clean_input_producto();
});


btn_modal_aceptar.addEventListener("click", function(e){
   if(e){
      console.log("modal ")
      var tr = tbody_cliente.children
      for (index = 0; index<tr.length; index++){
         if(tr[index].querySelector("input").checked){
            input_cli_codigo.value = tr[index].getElementsByTagName("td")[1].innerText + '\n'
            document.querySelector("#modal_cliente > div > div > div.modal-header > button").click();
            input_cli_codigo.focus();
            button_buscar_cliente.click();
            continue;
            
         }
      }
   
   }
});


/**
 * buscar producto
 */
 function buscar_producto(datos_producto){
   if(input_cli_codigo.value != ""){
      fetch(window.location.origin+"/operaciones/get/producto/"+datos_producto) //input_cli_codigo.value)
         .then(function(response_refund){
            return response_refund.json();
         }).then(function(json_response_refund){
          producto = json_response_refund;
         if(producto.length >= 1){
            //console.log(producto);
            temp_producto = producto
            input_inv_inventario.value = (input_inv_inventario.value).toUpperCase();
            input_inv_nombre.value = producto[0].INV_NOMBRE;

            if(producto[0].INV_COSTO_REF == "P"){
               document.querySelector("#costo").value = producto[0].INV_COSPROM
            }
            else if (producto[0].INV_COSTO_REF == "U"){
               document.querySelector("#costo").value = producto[0].INV_ULTCOSTO
            }

            switch(cliente[0].EXT_NIVPRECIO){
               case 1:
                  input_precio.value = producto[0].OTR_PRECIO1
                  break;
               case 2:
                  input_precio.value = producto[0].OTR_PRECIO2
                  break;
               case 3:
                  input_precio.value = producto[0].OTR_PRECIO3
                  break;
               case 4:
                  input_precio.value = producto[0].OTR_PRECIO4
                  break;
               case 5:
                  input_precio.value = producto[0].OTR_PRECIO5
                  break;
               case 6:
                  input_precio.value = producto[0].OTR_PRECIO6
                  break;
            }

         }   
         else{
            modal_alert("El Producto No Existe",
            `* El Producto no esta incluido en la lista de precios del cliente\n`+
            `* El Producto No aplica a este Cliente`, input_inv_inventario);
         }
      });
      
   }
   
}

/**
 *  fin buscar producto
 */




/**
 * funcione button quitar
 */

 var button_buscar_cliente = document.querySelector("#buscar_cliente");

 button_buscar_cliente.addEventListener("click", function(e){
   console.log("click btn buscar")
   //modal_cliente("Buscar Cliente");
   if(input_cli_codigo.value ==""){
      //mostarmos la ventana de buscar cliente
      document.querySelector("#launch_cliente").click();
      //añadimos la funcion de buscar 
      var btn_modal_cliente_buscar = document.querySelector("#modal_cliente_buscar")
      btn_modal_cliente_buscar.addEventListener("click", function(e){
        var modal_cli_input_cliente =  document.querySelector("#modal_cliente_nombre")//document.querySelector("#modal_cliente_nombre");
        var modal_cli_input_cadena = document.querySelector("#modal_cliente_cadena");
        var modal_cli_input_tienda = document.querySelector("#modal_cliente_tienda");
        if(e && modal_cliente_nombre !=""){
           //fetch modal buscar cliente 
           //&&  (modal_cli_input_cliente.value != "" || modal_cli_input_cadena.value != "" || modal_cli_input_tienda.value != ""
           var consulta =""
           clean_tbody(tbody_cliente);
           consulta =modal_cli_input_cliente.value.trim().replace(/ /g, "%");
           fetch(window.location.origin+"/operaciones/get/cliente_nombre/"+consulta
           ).then(function(response){
              
              if(response.status == 200){
               return response.json();
            }
            else{
               modal_alert("Oops!!, hay Problemas", "No se Realizo la operacion \n"+ response.statusText, btn_modal_cliente_buscar)
            }

           }).then(function(json_response){
              datos_consulta = json_response;
              if(datos_consulta[0].CLI_CODIGO){
                 console.log(datos_consulta[0].CLI_CODIGO);
                 for(index = 0; index < datos_consulta.length; index++){
                    var tr =  tbody_cliente.insertRow(index);
                    tr.setAttribute("name", "row_cliente");
                    //radio button
                    var btn_radio = document.createElement("input");
                    btn_radio.setAttribute("type", "radio");
                    btn_radio.setAttribute("id", "modal_radio_"+index);
                    btn_radio.setAttribute("name", "modal_cliente_check");             
                    var td_empresa = tr.insertCell(0);
                    var td_codigo  = tr.insertCell(1);
                    var td_nombre  = tr.insertCell(2);
                    var td_cadena  = tr.insertCell(3);
                    var td_tienda  = tr.insertCell(4);
                    var td_check   = tr.insertCell(5);
        
                    td_empresa.innerText = datos_consulta[index].CLI_EMPRESA;
                    td_codigo.innerText  = datos_consulta[index].CLI_CODIGO;
                    td_nombre.innerText  = datos_consulta[index].CLI_NOMBRE;
                    td_cadena.innerText  = datos_consulta[index].EXT_EXTRA6;
                    td_tienda.innerText  = datos_consulta[index].EXT_EXTRA7;
                    td_check.appendChild(btn_radio);
                    if(document.getElementsByName("row_cliente")){
                       var radio_cliente_select = document.getElementsByName("modal_cliente_check");
                       
                       radio_cliente_select.forEach(el => el.addEventListener('click', 
                          function(e){
                             //el.parentElement.parentElement.remove();
                             //console.log(el.parentElement);
                          }
                       ));
                    }
                  
                 }
                 input_cli_codigo.focus();


        
              }
   
           });
         }
         else if (document.querySelector("#input_cli_cliente").value !== ""){
            button_buscar_cliente.click();
         }
      });
   
   }
   else{
      
   }
   buscar_cliente(input_cli_codigo.value);

 });
 
 
function sumar_total(){
   var subt = document.getElementsByName("cell_monto");
   var grantotal = 0
   for (index =0; index<(subt.length); index++){
      grantotal+=parseFloat(subt[index].innerText);
   }                  
   document.querySelector("#grantotal").innerText = grantotal.toFixed(2);
}
 
 function modal_cliente(titulo){
    document.querySelector("#modal_cliente_title_long").innerText = titulo;
    //document.querySelector("#modal_cliente_message").innerText =  mensaje;
    //document.querySelector("#launch_cliente").click();
 }


function modal_alert(titulo, mensaje, elemento){
   document.querySelector("#modal_alert_title_long").innerText = titulo;
//   var div = document.createElement("div");
   document.querySelector("#modal_message").innerHTML =  mensaje;
   document.querySelector("#launch_alert").click();
   document.querySelector("#opcion").addEventListener("click", function(e){
         setTimeout(() => {
            elemento.focus();
            console.log("click focus");
         }, 300);
         
   });
}


//  var btn = document.activeElement
//  btn.parentElement.parentElement.remove();
function comprobar_datos_para_guardar(){
   var  todo_correcto_para_guardar = false;
   var date_dev = document.querySelector("#fecha_devolucion");
   var cod_customer = document.querySelector("#input_cli_cliente");
   var num_ref = document.querySelector("#referencia");
   var num_lot = document.querySelector("#lote");
   var cod_ruta = document.querySelector("#cli_vendedor");
   var class_store = document.querySelector("#EXT_EXTRA6");
   var class_customer = document.querySelector("#EXT_EXTRA7");
   var type_ing = document.querySelector("#tipo_ingreso");
   var total = parseFloat(document.querySelector("#grantotal").innerText);

   var estado = 0;
   
   switch(class_customer.value){
      case "WAL":
         if(date_dev.value == ""){
            modal_alert(date_dev.parentElement.innerText, "El Campo esta vacio", date_dev);
            estado +=1;
         }
         if(num_ref.value ==""){
            modal_alert(num_ref.parentElement.innerText, "El Campo esta vacio", num_ref);
            estado +=1;
         }
         if(num_lot.value ==""){
            modal_alert(num_lot.parentElement.innerText, "El Campo Lote esta vacio", num_lot);
            estado +=1;
         }
         if(type_ing.value == ""){
            modal_alert(type_ing.parentElement.innerText.split("\n")[0], "Seleccione una Opcion" , type_ing);
            type_ing.click()
            estado +=1;
         }
         if(cod_customer.value == ""){
            modal_alert(cod_customer.parentElement.innerText, "Esta Vacio el campo " , cod_customer);
            estado +=1;
         }
         if(total == 0 || isNaN(total) || total == ""){
            modal_alert(grantotal.parentElement.innerText, "Revise los Montos de la Lista de productos" , input_inv_inventario);
            estado +=1;
         }
         break;
      case "UNI":
         if(date_dev.value == ""){
            modal_alert(date_dev.parentElement.innerText, "El Campo esta vacio", date_dev);
            estado +=1;
         }
         if(num_ref.value ==""){
            modal_alert(num_ref.parentElement.innerText, "El Campo esta vacio", num_ref);
            estado +=1;
         }
         if(type_ing.value == ""){
            modal_alert(type_ing.parentElement.innerText.split("\n")[0], "Seleccione una Opcion" , type_ing);
            type_ing.click()
            estado +=1;
         }
         if(cod_customer.value == ""){
            modal_alert(cod_customer.parentElement.innerText, "Esta Vacio el campo " , cod_customer);
         }
         if(total == 0 || isNaN(total) || total == ""){
            modal_alert(grantotal.parentElement.innerText, "Revise los Montos de la Lista de productos" , input_inv_inventario);
            estado +=1;
         }
         break;
         
         
      default:
            if(date_dev.value == ""){
               modal_alert(date_dev.parentElement.innerText, "El Campo esta vacio", date_dev);
               estado +=1;
            }
            if(type_ing.value == ""){
               modal_alert(type_ing.parentElement.innerText.split("\n")[0], "Seleccione una Opcion" , type_ing);
               type_ing.click()
               estado +=1;
            }
            if(cod_customer.value == ""){
               modal_alert(cod_customer.parentElement.innerText, "Esta Vacio el campo " , cod_customer);
               estado +=1;
            }
            if(total == 0 || isNaN(total) || total == ""){
               modal_alert(grantotal.parentElement.innerText, "Revise los Montos de la Lista de productos" , input_inv_inventario);
               estado +=1;
            }
         break;

   }
   return estado;

}

var button_grabar = document.querySelector("#grabar");
button_grabar.addEventListener("click", function(e){
   var input_referencia = document.querySelector("#referencia");
   var i =  comprobar_datos_para_guardar();
   if(e && i == 0){        
      grabar_devolucion();
   } 
});

function grabar_devolucion(){
   var datos_dev = get_dataForm();
   if(datos_dev.length != 0){
      fetch(window.location.origin+"/operaciones/set/devolucion/"+datos_dev)//input_cli_codigo.value)
      .then(function(response_refund){
         if(response_refund.status == 200){
            return response_refund.json();
         }
         else{
            modal_alert("Problema al Guardar", "No se Realizo la operacion \n"+ response_refund.statusText, window)
         }
         //return response_refund.json();
      }).then(function(json_response_refund){
         var data = new Object()
         data = json_response_refund;
         if (data > 0){
            clean_all_form();
            modal_alert("Operacion Grabada", "Se ha guardado Existosamente.\n"+'No. Registro: <h5>'+data+'</h5>', window);
            input_fecha_devolucion.value =""
            select_causa.selectedIndex = 4
         }
         console.log(data);

      });
   }
}

var radio_tipo_cambio= document.querySelector("#tipo_cambio");
var radio_tipo_devolucion= document.querySelector("#tipo_devolucion");
var radio_tipo_vale= document.querySelector("#tipo_vale");

radio_tipo_cambio.addEventListener("click", function(e){
   if(e){   
    document.querySelector("#tipo_cambio > input").click()
   }
});
radio_tipo_devolucion.addEventListener("click", function(e){
   if(e){   
      document.querySelector("#tipo_devolucion > input").click()
   }
});
radio_tipo_vale.addEventListener("click", function(e){
   if(e){   
      console.log("torre")
      document.querySelector("#tipo_vale > input").click()
   }
});

function clean_tbody(table_tbody){
   while(table_tbody.hasChildNodes()){
      table_tbody.removeChild(table_tbody.firstChild);
   }
   document.querySelector("#grantotal").innerText ="0.0";
}



function get_dataForm(){
   var array = new Array();
   //var array_devolucion = new Array();
   var fecha = document.querySelector("#fecha_devolucion").value;
   var empresa = document.querySelector("#cli_empresa").value;
   var cliente = document.querySelector("#input_cli_cliente").value;
   var ruta = document.querySelector("#cli_vendedor").value;
   var ref = document.querySelector("#referencia").value
   var tipo_dev = undefined;
   var checks = document.getElementsByClassName("form-check-input");
   var texto = "";
   for (index=0; index<3; index++){
      if(checks[index+2].checked){
         tipo_dev = checks[index+2].value;
      }
   }

   for(index_linea = 0 ; index_linea < tbody.childElementCount; index_linea++){
      var linea = tbody.getElementsByTagName("tr");
      array.push(linea[index_linea].innerText)
   }

   for(i=0; i<array.length; i++){
      var item = array[i].split("\t")
      texto += item[0]+"|"+item[1]+"|"+item[4]+"|"+item[5]+"|"+item[6]+"|"+item[3]+"," ;
   }
   
   
   // array_devolucion.push(fecha);
   // array_devolucion.push(empresa);
   // array_devolucion.push(cliente);
   // array_devolucion.push(ruta);
   // array_devolucion.push(ref);
   // array_devolucion.push(tipo_dev);
   sumar_total()
   var total = document.querySelector("#grantotal").innerText;
   var lote = (document.querySelector("#lote").value).toString();
   var tipo_ingreso = document.querySelector("#tipo_ingreso").value;
   if(input_EXT_EXTRA7.value =="WAL"){
      array_devolucion =empresa+","+ruta+","+cliente+","+tipo_dev+","+ref+","+lote+","+fecha+","+tipo_ingreso+","+total+","
   }
   else if(input_EXT_EXTRA7.value =="UNI"){
      array_devolucion=empresa+","+ruta+","+cliente+","+tipo_dev+","+ref+","+""+","+fecha+","+tipo_ingreso+","+total+","
   }
   else if(input_EXT_EXTRA7.value !="UNI" || input_EXT_EXTRA7.value =="WAL" || input_EXT_EXTRA7.value ==""){
      ref = ""
      lote = ""
      array_devolucion =empresa+","+ruta+","+cliente+","+tipo_dev+","+""+","+""+","+fecha+","+tipo_ingreso+","+total+","
   }

   return array_devolucion+texto;

}



function addEvent(element, eventName, callback) {
   if (element.addEventListener) {
       element.addEventListener(eventName, callback, false);
   } else if (element.attachEvent) {
       element.attachEvent("on" + eventName, callback);
   } else {
       element["on" + eventName] = callback;
   }
}

function clean_all_form(){

   document.querySelector("#date_create").value ="";
   document.querySelector("#id_tienda_walmart").value ="";
   document.querySelector("#input_cli_cliente").value ="";
   document.querySelector("#referencia").value ="";
   document.querySelector("#lote").value ="";
   document.querySelector("#lista_precio").value ="";
   document.querySelector("#nivel_precio").value ="";
   clean_input_cliente();
   clean_input_producto();
   clean_tbody(tbody);
   document.querySelector("#grantotal").innerText ="0.0";
   document.querySelector("#tipo_ingreso").selectedIndex = 0
   document.querySelector("#causa").selectedIndex = 5
}


//sort table

const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
    )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
// do the work...
//document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
   document.querySelectorAll('#lista_clientes th').forEach(th => th.addEventListener('click', (() => {
    //const table = th.closest('table');
    const table = th.closest('table');
    //Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
    Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
        .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
        .forEach(tr => table.appendChild(tr) );
})));


const date_offset = new Date("1900-01-01 0:0:0.000").getTime();
var current_date;

function DateNumber(current_date) {
  var numberdate = (current_date.getTime() - date_offset) / (1000 * 3600 * 24);
  return Math.round(numberdate);
}

function FromNumbertoDate(number) {
  var reverse = date_offset + (number * (1000 * 3600 * 24));
  var date = new Date(reverse);
  return date
}
