const password = document.querySelector('.container');
const message = document.querySelector('.message');

password.addEventListener('keyup', function (e) {
     if (e.getModifierState('CapsLock')) {
         message.textContent = 'Bloq Mayús Activado';
         
     } else {
         message.textContent = '';
     }
 });

// set default empresa PAN
document.getElementById("empresa").options[3].setAttribute("selected", "")

 
