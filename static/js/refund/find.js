
function fill_select_with_customer(url, action, code_saleman ){
  fetch(url+action+code_saleman).then(function(response){
      //obtenemos la data en forma de json
      return response.json();
    }).then(function(json_response){
      //asignamos la respuesta a un objeto
      obj_customer_by_saleman = json_response
      eraser_option_select(select_customer);
      //agregamos la informacion del cliente por vendedor
      fill_selects_refund(obj_customer_by_saleman);
      //selecctionamos el dato del registro  y -1 por el indice del array que inica en 0 hasta N
      if (window.location.pathname == "/refund/buscar"){
        select_customer.selectedIndex = (obj_refund[0].LINEA_CLIENTE_VENDEDOR - 1);
      }
    return obj_customer_by_saleman;
  });
}


function getlist_saleman(url){
  fetch(url).then(function(response){
    //obtenemos la data en forma de json
    return response.json();
  }).then(function(json_response){
    obj_saleman  = json_response; 
    var option;
    if(obj_saleman.length !== 0){
      eraser_option_select (select_saleman);
      for ( index in obj_saleman){
        option = document.createElement("option");
        option.value = obj_saleman[index].VEN_CODIGO;
        option.textContent = obj_saleman[index].VEN_CODIGO + " - " +  obj_saleman[index].VEN_NOMBRE
        select_saleman.add(option)
      }
    }
    else{
      option = document.createElement("option");
      option.textContent = "El Vendedor NO esta agreagado al Listado"
      select_saleman.add(option)
    }
  });
}

function get_saleman(url, code_saleman){
  fetch(url+code_saleman).then(function(response){
    //obtenemos la data en forma de json
    return response.json();
  }).then(function(json_response){
    saleman  = json_response; 
    var option;
    if(saleman.length !== 0){
      /*
        eraser_option_select(select_saleman)
        for ( index in saleman){
          option = document.createElement("option");
          option.value = saleman[index].VEN_CODIGO;
          //option.textContent = saleman[index].VEN_CODIGO + " - " +  saleman[index].DINV_LINEA
          select_saleman.add(option)
        } 
      */
      // seleccionar el vendedor al que pertenece el registro.
      select_saleman.selectedIndex = (saleman[0].DINV_LINEA - 1);
    }
    else{
      option = document.createElement("option");
      option.textContent = "El Vendedor NO esta agreagado al Listado"
      select_saleman.add(option)
    }
  });
}

function getlist_customer(url){
  fetch(url).then(function(response){
    //obtenemos la data en forma de json
    return response.json();
  }).then(function(json_response){
    obj_saleman  = json_response; 
    if(obj_saleman.length !== 0){
      eraser_option_select (select_saleman);
      for ( index in obj_saleman){
        option = document.createElement("option");
        option.value = obj_saleman[index].VEN_CODIGO;
        option.textContent = obj_saleman[index].VEN_CODIGO + " - " +  obj_saleman[index].VEN_NOMBRE
        select_saleman.add(option)
      }
    }
    else{
      option = document.createElement("option");
      option.textContent = "El Vendedor NO tiene una lista de clientes"
      select_saleman.add(option)
    }
  });
}

function fill_list_input_product(Object_refund){
  if (Object_refund.length !==0 ){
    total = document.getElementById("total");
    var suma = 0.0
    for (index in Object_refund){
      linea = (Object_refund[index].LINEA_NUMERO - 1)
      item = document.getElementById("producto-"+ (linea).toString());
      item.value = parseInt(Object_refund[index].CANTIDAD);
      input_quantity = document.getElementById("precio_unitario_"+ (linea).toString());
      input_quantity.value = parseFloat(Object_refund[index].PRECIO_UNIDA_CLIENTE);
      subtotal = parseFloat(Object_refund[index].PRECIO_UNIDA_CLIENTE) * parseFloat(Object_refund[index].CANTIDAD)
      suma = subtotal+subtotal;
      item.offsetParent.parentElement.classList.add("table-info");
      // items.parentNode.parentElement buscamos el tr de cada linea
      // para  añadir la class blink
      blink_enable(item.parentNode.parentElement);
    }
    sub_total=(suma).toFixed(4) * parseInt(Object_refund.length)
    total.innerText = sub_total
    // Quitamos la class blink despues de 4790 ms
    blink_disable();
    
  }


}

function get_product_list(url,action, code_saleman){
  
  fetch(url+action+code_saleman).then(function(response){
    return response.json();
  }).then(function(json_response){
    // asignamos la respuesta a un objeto
    obj_product_by_saleman = json_response;
    // borramos el valor anterios
    fill_table_refund(obj_product_by_saleman); 
  });
}

function eraser_option_select(element_select){
  for ( index in element_select){
    //Elimina todo los elementos options de un elemento  Select de html
    element_select.remove(index)
  }
}

function blink_enable(element){
  element.classList.add("blink");
  product_table.scrollIntoView({block: "end", behavior: "smooth"});
}

function blink_disable(){
  var items = document.getElementsByClassName("blink");
  setTimeout(() => {
     var index = items.length
     while(index !==0){
      --index;
      items[index].classList.remove("blink");
     }
      
  }, 4790); 

}