function get_saleman(url,code_saleman){
  fetch(url+code_saleman).then(
    function(response){
      if (!response.ok) { 
        throw Error(response.status); 
      }
      return response.json();
    }).then(function(json_response){
      obj_saleman  = json_response; 
      return obj_saleman;
  });
  return obj_saleman;
}
function get_list_saleman(){
  url = window.origin+"/refund/api/get/list_saleman";
  fetch(url).then(
    function(response){
      return response.json();
    }).then(function(json_response){
      list_obj_saleman = json_response;
      fill_element_select_saleman(list_obj_saleman, select_vendedor);
      fill_element_select_customers(list_obj_saleman, select_cliente);
      return list_obj_saleman
    });
}
function get_customer(url,code_customer){
  fetch(url+code_customer).then(
    function(response){
       return response.json();
    }).then(function(json_response){
      obj_customer  = json_response; 
      return obj_customer;
    });
    return obj_customer;
}
function get_list_customers(code_saleman){    
    fetch(window.origin+"/refund/api/get/customer_by_saleman/"+code_saleman).then(
      function(response){
         return response.json();
      }).then(function(json_response){
        list_obj_customers  = json_response; 
        fill_element_select_customers(json_response,select_cliente);
        return list_obj_customers;
      });  
    
}
function get_list_products(url,code_refund){
  fetch(url+code_refund).then(
    function(response){
       return response.json();
    }).then(function(json_response){
      list_obj_customers  = json_response; 
      return list_obj_products;
    });
    return list_obj_products;
  
}

/**
 * funciones de llenado de datos
 */
function fill_element_select_saleman(Object, element_select){
  fetch(url)  .then(
    function(response){
       //obtenemos la data en forma de json
       return response.json();
    }).then(function(json_response){
      Object  = json_response; 
      list_obj_saleman = json_response;
       var option;
       if(Object.length !== 0){
          clean_element_select(element_select);
          for ( index in Object){
             option = document.createElement('option');
             option.value = Object[index].VEN_CODIGO;
             option.textContent = Object[index].VEN_CODIGO + " - " +  Object[index].VEN_NOMBRE
             element_select.add(option)
          }
       }
       else{
          option = document.createElement('option');
          option.textContent = "El Vendedor NO esta agreagado al Listado"
          element_select.add(option)
       }
    });
}

function fill_element_select_customers(Object,element_select){
  if (!element_select){
    fetch(window.origin+"/refund/api/get/customer_by_saleman/"+element_select).then(
      function(response){
         //obtenemos la data en forma de json
         return response.json();
      }).then(function(json_response){
         //asignamos la respuesta a un objeto   
         list_obj_customer = json_response;
         Object = list_obj_customer;
         if (list_obj_saleman.length !== 0){
           var option;
           for ( index in Object){  
             option = document.createElement("option");
             option.value = Object[index].LINEA_CLIENTE_VENDEDOR;
             option.textContent = (Object[index].CODIGO_CLIENTE +" - " + Object[index].NOMBRE_CLIENTE + " ["+ Object[index].DESCRIPCION_ETIQUETA +"]" );
             element_select.add(option);
           }
           return list_obj_customer
         }
         
      });
  }
  
}

function clean_element_select(element_select){
  //Elimina todo los elementos options de un elemento  Select de html
  for ( index in element_select){
    element_select.remove(index)            
 }
}