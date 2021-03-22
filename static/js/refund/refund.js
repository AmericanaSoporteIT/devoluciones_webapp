var form = document.getElementById("form");
var button_save = document.querySelector("#guardar");
//buscamos el nodo select con id=vendedor
var input_numero_devolucion  = document.querySelector("#numero")
var select_saleman = document.querySelector("#vendedor");
//buscamos el nodo select con el id= vendedor
var select_customer = document.querySelector("#cliente");
// buscamos la tabla que tenga el tbody con id=tbody
var product_table =  document.querySelector("#tbody");
//var tbody = document.getElementById("tbody")
var url_api = window.location;
var get_customer_by_saleman = "api/get/customer_by_saleman/";
var get_product_by_saleman = "api/get/product_by_saleman/";
var get_detail_refund = "api/get/refund_detail_by_id/"
var obj_saleman = new Object();
var obj_customer_by_saleman = new Object();
var obj_product_by_saleman = new Object();
var saleman = new Object();
var send_data;

var obj_refund = new Object();
var code_saleman;
var count_press_tab = 0;
var lista_productos = document.getElementsByName("producto");
var lista_precios = document.getElementsByName("precio_unitario")
var lista_codigos = document.getElementsByName("codigo_producto");

var button_save_changes = document.querySelector("#save_changes");

/**
 * @param String name
 * @return String
 */
function getParameterByName(name) {
   name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
   var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
   results = regex.exec(location.search);
   return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var id_refund = getParameterByName("id");
if (window.location.pathname == '/refund/buscar'){
   if(id_refund != undefined){
      number_refund = id_refund;      
      input_numero_devolucion.value = number_refund;
      button_search = document.getElementById("search");
      
      setTimeout(function(){ button_search.click(); }, 990);
   }
   
   input_numero_devolucion.addEventListener('keyup', function(e){ 
      //if(e.keyCode == 46 || e.keyCode == 27 || e.keyCode == 8){
      if(e.keyCode == 46 || e.keyCode == 27){
         input_numero_devolucion.value = "";
      }
      else if (e.keyCode == 13){
         button_search.click();
      }
   });

   button_save.setAttribute("hidden", "True")
   // numero_reclamo.setAttribute("class", "form-control form-control-sm is-valid");
   input_numero_devolucion.setAttribute("placeholder", "Buscar Devolucion por Numero");
   document.querySelector("#form > div.form-group.row.border.p-3.mx-3 > label:nth-child(1)").removeAttribute("hidden");
   document.querySelector("#form > div.form-group.row.border.p-3.mx-3 > div.col-sm-6").removeAttribute("hidden");
   document.querySelector("#form > div.form-group.row.border.p-3.mx-3 > div.col-sm-3").removeAttribute("hidden");

   button_search = document.getElementById("search");
   button_search.addEventListener("click", function(e){
      var alert_result = document.querySelector("body > section > div > div > div.col-md.pt-3.pb-0.mb-0 > div");
      var number_refund = document.getElementById("numero").value

      if(e && number_refund !==""){
         //borramos la busquea anterior
         eraser_row_table();
         //hacemos la consulta
         fetch(window.origin+"/refund/"+get_detail_refund+number_refund)
         .then(function(response_refund){
            return response_refund.json();
         }).then(function(json_response_refund){
             obj_refund = json_response_refund;
            if(obj_refund.length !== 0){  
               //pasamos el objeto que obtuvimos al hacer la peticion,
               fill_input_with_refund_info(obj_refund);
               getlist_saleman(window.origin  +"/refund/" + "api/get/list_saleman");
               get_saleman(window.origin + "/refund/" + "api/get/saleman/", obj_refund[0].CODIGO_VENDEDOR)
               fill_select_with_customer(window.origin + "/refund/", get_customer_by_saleman, obj_refund[0].CODIGO_VENDEDOR);


               
               /*   enviamos la informacion a la tabla para ser llenada    */
               //fill_table_refund(obj_refund);

               get_product_list(window.origin+"/refund/",get_product_by_saleman,obj_refund[0].CODIGO_VENDEDOR);
               //hacemos un focus al area de la tabla
               product_table.focus();
               
               //y hacemos un scroll suave al area de la table
               product_table.scrollIntoView({block: "center", behavior: "smooth"});
               alert_result.classList.remove("alert-warning")
               alert_message("Se encontro Registro", "alert-success show", 3800);
               //SELECTIONAMOS EL VENDEDOR POR SU NUMERO DE LINEA
               eraser_row_table();
               button_save.removeAttribute("hidden");
            }
            // si el objeto esta vacio entonce devolvemos un div alert para notifica que no  se encontro informacion
            else{
               alert_message("No se encontro ningun registro", "alert-warning show", 3800);
               form.reset();
               eraser_option_select(select_saleman);
               eraser_option_select(select_customer);
               button_save.setAttribute("hidden","True");
            }
            
         });
         
         // si el select vendedor no esta vacio entoces eleccionamos el vendedor
         if (select_customer.length >=1 ){
            select_customer.selectedIndex = (saleman[0].DINV_LINEA -1);
         }
         if (document.getElementById("producto-0") !== null ){
            fill_list_input_product(obj_refund);
         }
      }
      else{
         alert_message("Ingrese un Numero para hacer la busqueda", "alert-info show", 3800);
         form.reset();
         eraser_option_select(select_saleman);
         eraser_option_select(select_customer);
         eraser_row_table();
         button_save.setAttribute("hidden","True");
      }
   });
   //al cargar la ruta /refund/buscar
   input_numero_devolucion.focus();
   var concept_refund = document.getElementById("concepto");
    concept_refund.addEventListener("change", function(){
      switch (concept_refund.value){
         case "C":
            document.getElementById("reclamo").value = ""
            document.getElementById("lote").value = ""
            document.getElementById("reclamo").setAttribute("readonly",null)
            document.getElementById("lote").setAttribute("readonly",null)
            document.getElementById("fecha_reclamo").setAttribute("readonly",null)
            break;
         case "R":
            document.getElementById("fecha_reclamo").valueAsDate = new Date();   
            document.getElementById("reclamo").removeAttribute("readonly")
            document.getElementById("lote").removeAttribute("readonly")
            document.getElementById("fecha_reclamo").removeAttribute("readonly")
            break;
         case "V":
            document.getElementById("fecha_reclamo").valueAsDate = new Date();   
            document.getElementById("reclamo").removeAttribute("readonly")
            document.getElementById("lote").removeAttribute("readonly")
            document.getElementById("fecha_reclamo").removeAttribute("readonly")
            break;
      }
   });

   select_saleman.addEventListener("click", function(e){
      if(e){
         eraser_row_table();
         // Buscamos el select de vendedor
         // selected_saleman.value;
         // buscarmos el select de cliente      
         // obtenermos solo el codigo 
         code_saleman = select_saleman.value.split(" - ")
         // unimos el url con el codigo para consultar a la api
         // paramos el url completo [url_api + codigo de vendedor] a fetch para que consulter y traiga un dato              
         // consulta a flask y trae los datos
         fill_select_with_customer(window.origin +"/refund/",get_customer_by_saleman, code_saleman[0])
         eraser_row_table();
      }
      
   });
   //cuandor hacemos se cambia el elemento seleccionado en el select option
   select_saleman.addEventListener("change", function(e){
      // borramos la tabla antes de insertar datos
      while(product_table.hasChildNodes()){
         product_table.removeChild(product_table.firstChild);
      }
      count_press_tab = 0;
      if(e){
         // obtenemos el codigo del vendedor del elemento select
         code_saleman = select_saleman.value.split(" - ")
         select_customer.focus();
         // url = /refund
         get_product_list(window.origin +"/refund/",get_product_by_saleman,code_saleman[0])
      }
   
   });


  

}
else if (window.location.pathname == '/refund/'){   
   // funciones que se accionan al cargar la url /refund  "devolucion"
   select_saleman.focus();
   getlist_saleman(url_api+"api/get/list_saleman");
   get_product_list(url_api,get_product_by_saleman, default_saleman="303");
   fill_select_with_customer(window.origin+"/refund/",get_customer_by_saleman,default_saleman="303");
   document.getElementById("hora").value =  new Date().toLocaleTimeString();
   //cuando hacemos clic en el Menu de Vendedor
   select_saleman.addEventListener("click", function(e){
      if(e){
         eraser_row_table();
         // Buscamos el select de vendedor
         // selected_saleman.value;
         // buscarmos el select de cliente      
         // obtenermos solo el codigo 
         code_saleman = select_saleman.value.split(" - ")
         // unimos el url con el codigo para consultar a la api
         // paramos el url completo [url_api + codigo de vendedor] a fetch para que consulter y traiga un dato              
         // consulta a flask y trae los datos
         fill_select_with_customer(url_api,get_customer_by_saleman, code_saleman[0])
         eraser_row_table();
      }
      
   });
   //cuandor hacemos se cambia el elemento seleccionado en el select option
   select_saleman.addEventListener("change", function(e){
      // borramos la tabla antes de insertar datos
      while(product_table.hasChildNodes()){
         product_table.removeChild(product_table.firstChild);
      }
      count_press_tab = 0;
      if(e){
         // obtenemos el codigo del vendedor del elemento select
         code_saleman = select_saleman.value.split(" - ")
         select_customer.focus();
         // url = /refund
         get_product_list(url_api,get_product_by_saleman,code_saleman[0])
      }
   
   });
   
   
   
   // product_table.addEventListener("keyup", function (e) {
      
   //    if (e.isComposing || e.keyCode === 9  || e.keyCode === 13 ) {
   //       current_element = document.getElementsByName("producto");         
   //          if (count_press_tab  < current_element.length){
   //             current_element[count_press_tab].focus();
   //             current_element[count_press_tab].scrollIntoView();
   //             console.log(count_press_tab)
   //          }
   //          else if ( count_press_tab == select_customer.length  || count_press_tab>select_customer.length){
   //             count_press_tab = 0;
   //             document.getElementById("producto-0").focus();
   //          }
   //       count_press_tab++;
   //    }
   //    return count_press_tab;
   // });
   
   
   form.addEventListener("keydown", function(e) {
      var key = e.charCode || e.keyCode || 0;     
      if (key == 13) {
        //alert("I told you not to, why did you do it?");
        e.preventDefault();
        return false;
      }
    });

   var concept_refund = document.getElementById("concepto");
    concept_refund.addEventListener("change", function(){
      switch (concept_refund.value){
         case "C":
            document.getElementById("reclamo").value = ""
            document.getElementById("lote").value = ""
            document.getElementById("reclamo").setAttribute("readonly",null)
            document.getElementById("lote").setAttribute("readonly",null)
            document.getElementById("fecha_reclamo").setAttribute("readonly",null)
            break;
         case "R":
            document.getElementById("fecha_reclamo").valueAsDate = new Date();   
            document.getElementById("reclamo").removeAttribute("readonly")
            document.getElementById("lote").removeAttribute("readonly")
            document.getElementById("fecha_reclamo").removeAttribute("readonly")
            break;
         case "V":
            document.getElementById("fecha_reclamo").valueAsDate = new Date();   
            document.getElementById("reclamo").removeAttribute("readonly")
            document.getElementById("lote").removeAttribute("readonly")
            document.getElementById("fecha_reclamo").removeAttribute("readonly")
            break;

      }
    });

}//end else if /refund/

/***                    onload                                    ***/
//set data input
document.getElementById("fecha").valueAsDate = new Date();
document.getElementById("reclamo").setAttribute("readonly",null)
document.getElementById("lote").setAttribute("readonly",null)
document.getElementById("fecha_reclamo").setAttribute("readonly",null)
document.getElementById("fecha_reclamo").valueAsDate = new Date();

//block concepto

function fill_selects_refund(Object_from_json_response){
   for ( index in Object_from_json_response){
      //creamos un nodo de tipo option
      var option = document.createElement("option");
      //añadimos atributos al elemento option 
      option.setAttribute("name", "item_name_customer");
      //cargamos la informacion del previamente guardada en un objeto para poder iterar sobre el objeto
      option.textContent = 
         Object_from_json_response[index].LINEA_CLIENTE_VENDEDOR 
            + " - " 
            + Object_from_json_response[index].CODIGO_CLIENTE 
            + " - " 
            + Object_from_json_response[index].NOMBRE_CLIENTE 
            + " - " 
            + Object_from_json_response[index].DESCRIPCION_ETIQUETA;
      option.value = Object_from_json_response[index].CODIGO_CLIENTE;
      //Y añadimos el elemento option al select 
      select_customer.add(option, null);
   }

}

function fill_table_refund(Object_from_json_response){
   for (index in Object_from_json_response){ 
      var tr = tbody.insertRow(index);

      var td_numero_linea = tr.insertCell();
         td_numero_linea.setAttribute("id", Object_from_json_response[index].LINEA_NUMERO );
         td_numero_linea.setAttribute("name", "numero_linea");
      var number_line = document.createTextNode(Object_from_json_response[index].LINEA_NUMERO);

      var td_code_product = tr.insertCell();
         td_code_product.setAttribute("id", "td_codigo_" + index);
         td_code_product.setAttribute("name", "td_codigo");
      var span_code_product = document.createElement("span");
         span_code_product.textContent = Object_from_json_response[index].CODIGO_PRODUCTO;

      var input_code_product = document.createElement("input");
         input_code_product.setAttribute("type", "hidden");
         input_code_product.setAttribute("name", "codigo_producto")
         input_code_product.setAttribute("class", "form-control form-control-sm");
         input_code_product.setAttribute("readonly", "True");
         input_code_product.setAttribute("value", Object_from_json_response[index].CODIGO_PRODUCTO);
      
      var td_nombre_producto = tr.insertCell();
         td_nombre_producto.setAttribute("name", "td_producto");   
         td_nombre_producto.classList.add("text-small")
         //td_nombre_producto.setAttribute("class", "col col-xs");
         
      var input_nombre_producto =  document.createTextNode(Object_from_json_response[index].NOMBRE_PRODUCTO);
                     
      var td_product_qty = tr.insertCell();
         td_product_qty.setAttribute("name", "td_cantidad");
      var input_quantity  = document.createElement("input")
         input_quantity.setAttribute("name", "producto");
         input_quantity.setAttribute("id", "producto-"+index);
         input_quantity.setAttribute("class", "form-control form-control-sm");
         input_quantity.setAttribute("type", "number");
         input_quantity.setAttribute("min", "0");
         input_quantity.setAttribute("placeholder", "0");
         
      var td_unit_price = tr.insertCell();
         td_unit_price.setAttribute("name", "td_precio");
      var input_unit_price = document.createElement("input");
         input_unit_price.setAttribute("type", "number");
         input_unit_price.setAttribute("id", "precio_unitario_"+index);
         input_unit_price.setAttribute("name", "precio_unitario");
         input_unit_price.setAttribute("class", "form-control form-control-sm");
         input_unit_price.setAttribute("placeholder", "0.0");
         input_unit_price.setAttribute("min", "0.01");
         input_unit_price.setAttribute("step", "0.25");
      
      for (col=0;col<=4;col++) { 
      //console.log(index + "-" + col)            
         td_numero_linea.appendChild(number_line);
         td_code_product.appendChild(span_code_product);
         td_code_product.appendChild(input_code_product);
         td_nombre_producto.appendChild(input_nombre_producto);
         td_product_qty.appendChild(input_quantity);
         td_unit_price.appendChild(input_unit_price);
      }
   
   }
   // si existe devolucion de producto entoces llenamos el input con la cantidad
   // y añadimos la classe active en el tr de la tabla
   if(obj_refund && obj_refund !==0){
      fill_list_input_product(obj_refund);
   }
}


function fill_input_with_refund_info(Object_response_json){  
   var tipo_devolucion = Object_response_json[0].DINDCH_TIPDEV; 
   var select_concepto = document.getElementById("concepto")
   if (tipo_devolucion == "C"){
      select_concepto.selectedIndex = "0"
   }
   else if (tipo_devolucion == "R"){
      select_concepto.selectedIndex = "1"
   }
   else if (tipo_devolucion == "V"){
      select_concepto.selectedIndex = "3"
   }
   document.getElementById("hora").removeAttribute("hidden")
   document.getElementById("reclamo").value = Object_response_json[0].NUMERO_RECLAMO;
   document.getElementById("lote").value = Object_response_json[0].LOTE_RECLAMO;
   document.getElementById("fecha_reclamo").valueAsDate = new Date(FromNumbertoDate(Object_response_json[0].FECHA_RECLAMO));
   document.getElementById("fecha").valueAsDate = new Date(FromNumbertoDate(Object_response_json[0].FECHA_DEVOLUCION));
   document.getElementById("hora").value = new Date(NumberToTime(Object_response_json[0].HORA_DEVOLUCION)).toLocaleTimeString();
}

function eraser_row_table(){
   while(product_table.hasChildNodes()){
      product_table.removeChild(product_table.firstChild);
   }
}

function alert_message(message, type_alert, time){
   
   div_alert = document.querySelector("body > section > div > div > div.col-md.pt-3.pb-0.mb-0 > div");
   content_message = document.querySelector("#message");
   span_emoji = document.querySelector("#emoji");

   switch(type_alert){
       case "alert-success show":
           span_emoji.textContent =""
           content_message.textContent = message
           div_alert.classList.remove("alert-info");
           div_alert.classList.remove("alert-warning");
           div_alert.classList.add("alert-success", "show");
           
       break;
       case "alert-info show":
           span_emoji.textContent = "" 
           content_message.textContent = message
           div_alert.classList.remove("alert-success");
           div_alert.classList.remove("alert-warning");
           div_alert.classList.add("alert-info", "show");
       break;
       case "alert-warning show":
           span_emoji.textContent = "" //"¯\\_(ツ)_/¯";
           content_message.textContent = message
           div_alert.classList.remove("alert-success");
           div_alert.classList.remove("alert-info");
           div_alert.classList.add("alert-warning", "show");
       break;
   }
   setTimeout(() => {
      div_alert.classList.remove("show");
    }, time);
}


form.addEventListener("submit", function(e){
   e.preventDefault();
   
});


   button_save_changes.addEventListener("click", function(e){
      var count_productos = 0;
   
      send_data = []
      data_producto = []
      //comprobar que los input de productos no esten vacios o en 0
      if (e){
         form.method = "POST";
         for (index=0;index<lista_productos.length;index++){    
            if ( (lista_productos[index].value !== "" && lista_productos[index].value !== "0" ) && (lista_precios[index].value !=="" && lista_precios[index].value !== "0")){
               linea = index
               data_producto[count_productos] = linea+1 + "-" + lista_codigos[index].value  + "-" + lista_productos[index].value ;
               ++count_productos;
            }
         }
         
         if(count_productos >=1){
         //"http://localhost:5000/refund/"
            form.submit();
            
         }
         else{
            document.querySelector("#SaveChanges_Modal > div > div > div.modal-footer > button.btn.btn-secondary").click();
            document.querySelector("body > div:nth-child(3)").scrollIntoView({block:'start', behavior:'smooth'});
            alert_message("No se puede Guardar Devoluciones Vacias!", "alert-warning show", 5000);
            
         }
         //console.log("evento click button save_change");
         
      }
   });
   
   var cancel_save = document.querySelector("#SaveChanges_Modal > div > div > div.modal-footer > button.btn.btn-secondary");
      cancel_save.addEventListener("click", function(e){
      //form.reset();
   });



   product_table.addEventListener("keyup", function(e){
      cant = document.getElementsByName("producto");
      costo = document.getElementsByName("precio_unitario");
      var count_items 
      var count_price 
      console.log("key up  table input")
      
      for (index in cant){
            count_items = cant[index].value;
            console.log("cant: ", cant[index].value)
      }
      for (index in costo){
         count_price = costo[index].value;
         console.log("costo: ",costo[index].value)
      }

      
   });



// button_save_changes.addEventListener("click", function(e){
//    var count_productos = 0;

//    send_data = []
//    data_producto = []
//    if (e){
//       //form.method = "post";
//       //form.submit(); 
//       for (index=0;index<lista_productos.length;index++){    
//          if (lista_productos[index].value !== "" && lista_productos[index].value !== "0" ){
//             linea = index
//             data_producto[count_productos] = { "numero_linea": linea+1,"codigo":lista_codigos[index].value ,"cantidad": lista_productos[index].value }
//             // formData.append("linea", linea+1);
//             // formData.append("codigo", lista_codigos[index].value);
//             // formData.append("cantidad", lista_productos[index].value);
//             ++count_productos;
//          }
//       }
//       json_response = JSON.stringify(data_producto);
//       console.log();
//       if(data_producto !== 0){
//             console.log("data es CERO")         
//       }
//       //"http://localhost:5000/refund/"
//       fetch(window.location.href, {
//          method: "POST",
//          body: json_response,
//          headers: {
//             'Content-type': 'application/json; charset=UTF-8'
//          }
//       }).then(function(response){
//          if (response.status === 200 ){
//             close_modal = document.querySelector("#SaveChanges_Modal > div > div > div.modal-header > button");
//             //auto close modal
//             document.querySelector("#SaveChanges_Modal > div > div > div.modal-header > button").click()

//          }
//          console.log(response.status);
//       });
//       form.reset();
       
//    }
// });