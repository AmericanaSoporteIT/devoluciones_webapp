//enbezadp
var input_fecha_devolucion = document.querySelector("#fecha_devolucion");
var select_empresa = document.querySelector("#cli_empresa");
var input_ruta = document.querySelector("#cli_vendedor");
var input_vendedor = document.querySelector("#ven_nombre");
var input_lista_precio = document.querySelector("#lista_precio");
var input_nivel_precio = document.querySelector("#nivel_precio");
var select_tipo_ingreso = document.querySelector("#tipo_ingreso");

//detalle
var input_inv_inventario = document.querySelector("#inv_inventario");
var input_cantidad = document.querySelector("#cantidad");
var input_precio = document.querySelector("#precio");
var select_causa = document.querySelector("#causa");
var select_tipo_ingreso = document.querySelector("#tipo_ingreso");
var button_agregar = document.querySelector("#agregar");
var button_grabar = document.querySelector("#grabar");
var tbody = document.querySelector("#tbody_detalle");

//objetos para consultas
var ruta = new Object();
var producto = new Object();
var temp_producto = new Object();


// funciones de ruta
input_ruta.addEventListener("keydown", function(e){
   if((e.keyCode == 9 || e.keyCode == 13 || e.keyCode == 32 ) && input_ruta.value !=""){
      buscar_ruta(input_ruta.value,select_empresa.value)
   }
});

function buscar_ruta(ruta,empresa){
   busqueda= ruta+ ',' + empresa
   fetch(window.location.origin+"/operaciones/get/ruta/"+ busqueda)
   .then(function(response){
      if(response.status == 200){
         return response.json();
      }else{
         modal_alert("Problema Al buscar la Ruta",
         response.statusText, input_ruta);   
      }      
   }).then(function(json_response){
      ruta = json_response;
   if(ruta.length >= 1){
      input_vendedor.value = ruta[0].VEN_NOMBRE;
      input_lista_precio.value = ruta[0].VXT_MONEDA;
      input_nivel_precio.value = ruta[0].VXT_NIVPRECIO;

   }
   else{
      clean_input_ruta();
      modal_alert("Problema Al buscar la Ruta",
      `El Codigo es incorrecto o la ruta no existe`, input_ruta);
   }
   });

}


input_inv_inventario.addEventListener("keydown", function(e){
   if(e.keyCode == 8 || e.keyCode == 27 || e.keyCode ==46 ){
      clean_input_producto();
   }
   if(input_ruta.value!="" && input_lista_precio.value !="" && input_nivel_precio.value !=""){
      if((e.keyCode == 9 || e.keyCode == 13 || e.keyCode == 32 ) && input_inv_inventario.value !=""){
         var producto ="";
         var ruta="";
         var empresa ="";
         producto =  input_inv_inventario.value;
         ruta = input_ruta.value;
         empresa = select_empresa.value;
         clean_input_producto();
         buscar_producto(producto, ruta, empresa);
      }   
   }
   else{
      if(input_ruta.value =="" || input_lista_precio.value =="" || input_nivel_precio.value !=""){
         modal_alert("Falta el Codigo de Ruta",
         'Ingrese un Dato Valido', input_ruta);
      }
   }
});

button_agregar.addEventListener("click", function(e){
   var producto =""; var cantidad="";   var precio =""; var ruta=""; var empresa ="";
   producto =  input_inv_inventario.value;
   cantidad = input_cantidad.value;
   precio = input_precio.value;
   ruta = input_ruta.value;
   empresa = select_empresa.value;
   if(producto!="" && cantidad != 0  ){
      // if(e){
         clean_input_producto();
         //buscar_producto(producto, ruta,empresa);
         agregar_al_detalle(producto, cantidad,ruta, empresa)
      // }
      
 
   }
   if(producto!="" && cantidad == 0  ){
      modal_alert("Falta la Cantidad del Producto", "La cantidad No puede ser 0\no estar vacía", input_cantidad);
   }

   

});

function agregar_al_detalle(producto, cantidad,ruta, empresa){
   if (producto != "", ruta !="", empresa !=""){
   
      var size_table =tbody.childElementCount
      var col_count = tbody.childElementCount+1
      var tr = tbody.insertRow(size_table);
      var btn_delete = document.createElement("button");
      var btn_edit = document.createElement("button");
      var btn_term = document.createElement("button");
      //creacion de elemento
      var td_col_numero = tr.insertCell(0);
      var td_inv_inventario = tr.insertCell(1);
      var td_inv_nombre = tr.insertCell(2);
      var td_causa = tr.insertCell(3)
      var td_cantidad = tr.insertCell(4);
      var td_inv_valor = tr.insertCell(5);
      var td_monto = tr.insertCell(6);
      var td_button_edit = tr.insertCell(7);         
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



      // buscarmos el producto 
      busqueda= producto + ',' + ruta + ',' + empresa
      fetch(window.location.origin+"/operaciones/get/producto/"+ busqueda)
         .then(function(response){
            if(response.status == 200){
               return response.json();
            }else{
               modal_alert("Problema Al buscar el Producto",
               response.statusText, input_ruta);   
            }      
         }).then(function(json_response){
            producto = json_response;
            if(producto.length >= 1){
               var td_button_delete = tr.insertCell(8);
               var btn_delete = document.createElement("button");
               btn_delete.setAttribute("id", "btn-delete"+(size_table))
               btn_delete.setAttribute("name", "quitar");
               btn_delete.setAttribute("class", "btn btn-danger btn-sm")
               btn_delete.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
               <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
               <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
             </svg>`
         
             
               //agregar contenido al elemento
               td_col_numero.innerHTML = (col_count);
               td_inv_inventario.innerHTML = producto[0].OTR_INVENTARIO;
               td_inv_nombre.innerHTML = producto[0].INV_NOMBRE;
               td_causa.innerHTML = (select_causa[select_causa.selectedIndex].innerHTML).split(" - ")[1];
               td_cantidad.innerHTML = parseFloat(cantidad).toFixed(2);
               td_inv_valor.innerHTML =  parseFloat(producto[0].OTR_PRECIO1).toFixed(2);
               td_monto.innerHTML = (parseFloat(producto[0].OTR_PRECIO1) * parseFloat(cantidad)).toFixed(2);
               td_button_edit.appendChild(btn_edit);
               td_button_edit.appendChild(btn_term);
               td_button_delete.appendChild(btn_delete);               

      
            if(producto[0].INV_COSTO_REF == "P"){
                  document.querySelector("#costo").value = producto[0].INV_COSPROM
               }
            else if (producto[0].INV_COSTO_REF == "U"){
               document.querySelector("#costo").value = producto[0].INV_ULTCOSTO
            }


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
      
               sumar_total();
            }

         }
         else{
            clean_input_ruta();
            modal_alert("Problema Al buscar el Producto",
            `El Codigo es incorrecto o el Producto no Aplica`, input_ruta);
         }
         
      });   
      


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


function buscar_producto(producto, ruta, empresa){

   temp_producto = new Object()
   busqueda= producto + ',' + ruta + ',' + empresa
   fetch(window.location.origin+"/operaciones/get/producto/"+ busqueda)
   .then(function(response){
      if(response.status == 200){
         return response.json();
      }else{
         modal_alert("Problema Al buscar el Producto",
         response.statusText, input_ruta);   
      }      
   }).then(function(json_response){
      producto = json_response;
      temp_producto = producto;
      if(producto.length >= 1){
         input_inv_inventario.value = producto[0].OTR_INVENTARIO
         input_precio.value =  producto[0].OTR_PRECIO1

         if(producto[0].INV_COSTO_REF == "P"){
            document.querySelector("#costo").value = producto[0].INV_COSPROM
         }
         else if (producto[0].INV_COSTO_REF == "U"){
            document.querySelector("#costo").value = producto[0].INV_ULTCOSTO
         }
      }
      else{
         clean_input_ruta();
         modal_alert("Problema Al buscar el Producto",
         `El Codigo es incorrecto o el Producto no Aplica`, input_ruta);
      }
   });   
}

function comprobar_datos_para_guardar(){
   var  todo_correcto_para_guardar = false;
   sumar_total();
   
   var date_dev = document.querySelector("#fecha_devolucion");
   var ruta = document.querySelector("#cli_vendedor");
   var num_ref = document.querySelector("#referencia");
   var num_lot = document.querySelector("#lote");
   var cod_ruta = document.querySelector("#cli_vendedor");
   var type_ing = document.querySelector("#tipo_ingreso");
   var total = parseFloat(document.querySelector("#grantotal").innerText);

   var estado = 0;

         

   if(date_dev.value == ""){
      modal_alert(date_dev.parentElement.innerText, "El Campo esta vacio", date_dev);
      estado +=1;
   }
   if(type_ing.value == ""){
      modal_alert(type_ing.parentElement.innerText.split("\n")[0], "Seleccione una Opcion" , type_ing);
      type_ing.click()
      estado +=1;
   }
   if(ruta.value == ""){
      modal_alert(ruta.parentElement.innerText, "Esta Vacio el campo " , ruta);
      estado +=1;
   }
   if(total == 0 || isNaN(total) || total == ""){
      modal_alert(grantotal.parentElement.innerText, "Revise los Montos de la Lista de productos" , input_inv_inventario);
      estado +=1;
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
            modal_alert("Operacion Grabada", "Se ha guardado Existosamente"+'No. Registro: <h5>'+data+'</h5>', window);
            select_tipo_ingreso.value = ""
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
   //var ref = document.querySelector("#referencia").value
   var tipo_dev = document.querySelector("#tipo_cambio > input").value
   var checks = document.getElementsByClassName("form-check-input");
   var texto = "";

   sumar_total()
   var total = document.querySelector("#grantotal").innerText;
   var tipo_ingreso = document.querySelector("#tipo_ingreso").value;
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
   array_devolucion =empresa+","+ruta+","+cliente+","+tipo_dev+","+""+","+""+","+fecha+","+tipo_ingreso+","+total+","
   

   return array_devolucion+texto;

}
function clean_input_cliente(){
   input_ruta.value = "";
   input_vendedor.value = "";
   input_fecha_devolucion = "";
   document.querySelector("#costo").value ="";
}


function clean_all_form(){

   document.querySelector("#date_create").value ="";
   document.querySelector("#referencia").value ="";
   document.querySelector("#cli_vendedor").value =""
   document.querySelector("#lista_precio").value ="";
   document.querySelector("#nivel_precio").value ="";
   clean_input_cliente();
   clean_input_producto();
   clean_tbody(tbody);
   document.querySelector("#costo").value ="";
   document.querySelector("#grantotal").innerText ="0.0";
   document.querySelector("#tipo_ingreso").selectedIndex = 0
   document.querySelector("#causa").selectedIndex = 5
}









function sumar_total(){
   var subt = document.getElementsByName("cell_monto");
   var grantotal = 0
   for (index =0; index<(subt.length); index++){
      grantotal+=parseFloat(subt[index].innerText);
   }                  
   document.querySelector("#grantotal").innerText = grantotal.toFixed(2);
}

//funciones de limpeza de campos

function clean_input_ruta(){
   input_fecha_devolucion.value =""
   select_empresa
   input_ruta.value = ""
   input_vendedor.value = ""
   input_lista_precio.value = ""
   input_nivel_precio.value = ""
}
function clean_input_producto(){
   input_inv_inventario.value = ""
   input_cantidad.value = ""
   input_precio.value = ""
   //select_causa.value = ""
   select_tipo_ingreso.value = ""
   document.querySelector("#costo").value ="";
}


// funciones de alertar y modals
function modal_ruta(titulo){
   document.querySelector("#modal_cliente_title_long").innerText = titulo;
   //document.querySelector("#modal_cliente_message").innerText =  mensaje;
   //document.querySelector("#launch_cliente").click();
}


function modal_alert(titulo, mensaje, elemento){
  document.querySelector("#modal_alert_title_long").innerText = titulo;
//   var div = document.createElement("div");
  document.querySelector("#modal_message").innerHTML = mensaje;
  document.querySelector("#launch_alert").click();
  document.querySelector("#opcion").addEventListener("click", function(e){
        setTimeout(() => {
           elemento.focus();
           console.log("click focus");
        }, 300);
        
  });
}




