var check_devnumero     = document.getElementById("check_devnumero");
var check_vendedor      = document.getElementById("check_vendedor");
var check_clicodigo     = document.getElementById("check_clicodigo");
var check_fecha         = document.getElementById("check_fecha");
var check_numrecl       = document.getElementById("check_numrecl");
var check_loterecl      = document.getElementById("check_loterecl");
var check_fecharecla    = ""
var input_area          = document.querySelector("#input_area");
var button_buscar       = document.getElementById("buscar");

var input_devnumero     = "";
var input_vendedor      = "";
var input_clicodigo;     
var input_fecha_inicial = "";
var input_fecha_final   = "";
var input_numrecl       = "";
var input_loterecl      = "";
var input_fecharecla    = "";

document.getElementById("input_fecha_inicial").valueAsDate = new Date();
document.getElementById("input_fecha_final").valueAsDate = new Date();

var obj_response = new Object();;

var lista_filtros = {fechaincial:"input_fecha_inicial", fechafinal:"input_fecha_final"}
// const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

check_clicodigo.addEventListener("change", function(e){
    
    if(this.checked){
        input_area.innerHTML += `<div class="col"><label class="mb-0">Cliente</label><input id="input_clicodigo" name="input_filter" class="form-control form-control-sm" required placeholder="Codigo de Cliente"></div>`;
        lista_filtros.clicodigo = "input_clicodigo";
        console.log(lista_filtros)
        valor = this.value
    }
    else{
        document.getElementById("input_clicodigo").parentNode.remove();
        delete lista_filtros.clicodigo
        console.log(lista_filtros)
    }

});

check_fecha.addEventListener("change", function(e){
    if(this.checked){
        input_area.innerHTML += `<div class="col"><label class="mb-0">Rango de Fecha</label><div class="col"><input id="input_fecha_inicial" name="input_filter" class="form-control form-control-sm" type="date" required placeholder="Fecha Incial" ></div><div class="col mt-2"><input id="input_fecha_final" name="input_filter" class="form-control form-control-sm" type="date" required placeholder="Fecha Final" ></div></div>`;
        lista_filtros.fechaincial = "input_fecha_inicial";
        lista_filtros.fechafinal  = "input_fecha_final";

        document.getElementById("input_fecha_inicial").valueAsDate = new Date();
        document.getElementById("input_fecha_final").valueAsDate = new Date();

    }
    else{
        delete lista_filtros.fechaincial
        delete lista_filtros.fechafinal
        document.getElementById("input_fecha_inicial").parentElement.parentNode.remove();
        console.log(lista_filtros)
    }

});

check_numrecl.addEventListener("change", function(e){
    if(this.checked){
        input_area.innerHTML += `<div class="col"><label class="mb-0">N° Reclamo</label><input id="input_numrecl" name="input_filter" class="form-control form-control-sm" required placeholder="N° de Reclamo"></div>`;
        lista_filtros.numrecl ="input_numrecl";
    }
    else{
        document.getElementById("input_numrecl").parentNode.remove();
        delete lista_filtros.numrecl
    }

});

check_loterecl.addEventListener("change", function(e){
    if(this.checked){
        input_area.innerHTML += `<div class="col"><label class="mb-0">N° de Lote</label><input id="input_loterecl" name="input_filter" class="form-control form-control-sm" required placeholder="N° lote"></div>`
        lista_filtros.loterecl = "input_loterecl";
    }
    else{
        document.getElementById("input_loterecl").parentNode.remove();
        delete lista_filtros.loterecl
    }

});

button_buscar.addEventListener("click", function(e){

    var formData = new FormData()
    inputData = Object.entries(lista_filtros)

    inputData.forEach(function(element){ 
        formData.append(element[0], document.querySelector("#"+element[1]).value);
        console.log ( document.querySelector("#"+element[1]).value)
     });
     alert_message("Buscando...", "alert-info show", 3800);

    // hacemos una consulta a la base de datos enviado por post como parametros de
    // busqueda que son los filtros y armar el query al url /refund/list
    fetch(window.origin + "/refund/list", {
    //fetch(window.origin+ "/refund/api/get/list_refund", {
            method: "POST",
            body:formData
        }).then(function(response_refund){
            return response_refund.json();
         }).then(function(json_response_refund){
            obj_response = json_response_refund;
            console.log("obj", obj_response);
        if(obj_response == 0){
                alert_message("No se encontro nada", "alert-warning show", 3800);
                table = document.querySelector("#table");
                tbody = table.children[1]
                eraser_row_table(tbody)   
    
        }
        if (obj_response != 0 ){
            table = document.querySelector("#table");
            tbody = table.children[1]
            eraser_row_table(tbody)
            for (index in obj_response){ 
                var tr = tbody.insertRow(index);
                    
                var td_numero = tr.insertCell();
                var td_vendedor = tr.insertCell();
                var td_cliente = tr.insertCell();
                var td_fecha = tr.insertCell();    
                var td_fecha_reclamo = tr.insertCell();
                var td_opciones= tr.insertCell();

                tr.setAttribute("name", "linea_registro")
                td_fecha.setAttribute("class", "text-center");
                td_fecha_reclamo.setAttribute("class", "text-center");
                
                var numero = document.createTextNode(obj_response[index].DINDCH_DEVNUMERO);
                var vendedor = document.createTextNode(obj_response[index].DINDCH_VENDEDOR);
                var cliente = document.createTextNode(obj_response[index].DINDCH_CLICODIGO +" - "+obj_response[index].CLI_NOMBRE);
                var fecha = document.createTextNode(FromNumbertoDate(obj_response[index].DINDCH_FECHA).toLocaleDateString());
                var fecha_reclamo = document.createTextNode(FromNumbertoDate(obj_response[index].DINDCH_FECHARECLA).toLocaleDateString());
                var button_ver = document.createElement("a");
                button_ver.setAttribute("name", "editar");
                button_ver.setAttribute("class", "btn btn-info btn-sm");
                button_ver.setAttribute("href", "/refund/buscar?" + "id="+ obj_response[index].DINDCH_DEVNUMERO);
                button_ver.innerText = "Ver";

                for (col=0;col<=4;col++) { 
                    td_numero.setAttribute("id", "numero");
                    td_numero.setAttribute("name", "numero");
                    td_numero.appendChild(numero);
                    td_vendedor.appendChild(vendedor);
                    td_cliente.appendChild( cliente);
                    td_fecha.appendChild(fecha);
                    // td_fecha.appendChild( document.createTextNode(FromNumbertoDate(obj_response[index][4]).toLocaleDateString(("es-GT", options)));
                    td_fecha_reclamo.appendChild(fecha_reclamo);
                    td_opciones.appendChild(button_ver);
                }
            } 
            alert_message("Encontramos esto...", "alert-success show", 3800);  
        }
    
    });

});


function eraser_row_table(table){
    while(table.hasChildNodes()){
       table.removeChild(table.firstChild);
    }
 }

// funcion format   que funciona como la de python  str.format()
String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
      return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};


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
    // if(type_alert == "alert-success show" ){
    //     span_emoji.textContent =""
    //     content_message.textContent = message
    //     div_alert.classList.add("alert-success", "show");

    // }
    // else if (type_alert == "alert-info show"){
    //     span_emoji.textContent = "" 
    //     content_message.textContent = message
    //     div_alert.classList.add("alert-info", "show");
    //  }
    // else if (type_alert == "alert-warning show"){
    //    span_emoji.textContent = "" //"¯\\_(ツ)_/¯";
    //    content_message.textContent = message
    //    div_alert.classList.add("alert-warning", "show");
    // }
    setTimeout(() => {
       div_alert.classList.remove("show");
     }, time);
 }
 
/*

<div class="col"><input id="input_clicodigo" name="input_filter" class="form-control form-control-sm" required placeholder="Codigo de Cliente" hidden></div>
<div class="col"><input id="input_numrecl" name="input_filter" class="form-control form-control-sm" placeholder="N° de Reclamo" hidden></div>
<div class="col"><input id="input_loterecl" name="input_filter" class="form-control form-control-sm" placeholder="N° lote"></div>
<div class="col"><input id="input_devnumero" name="input_filter" class="form-control form-control-sm" placeholder="Correlativo Interno" hidden></div>
<div class="col"><input id="input_vendedor" name="input_filter" class="form-control form-control-sm" placeholder="Codigo de Vendedor" hidden></div>

*/