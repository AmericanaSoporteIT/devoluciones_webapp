var date_offset = new Date("1900-01-01 0:0:0.000").getTime();
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

function NumberToTime(number) {
  //obtenemos la fecha en hoy en segundos
  today = new Date().toDateString();
  //nos intereza que la la hora este iniciada en 00:00:00.000 y el dia sea HOY (current_day)
  time_init = new Date(today);
  //multiplicamos por el factor de 864 que son millesimas y convertimos el numero de segundos a una fecha legible
  time_final = new Date((number * 864));
  time = new Date((time_final.valueOf() + time_init.valueOf()))
  return new Date(today + " " + time.toTimeString())
}

function TimeToNumber(time) {
  var today = new Date().toDateString() // "Tue Jan 05 2021"
  var date_init = new Date(today); //nos intereza que la la hora este iniciada en 00:00:00.000 y sea del dia
  var date_final = new Date(today + " " + time)  // Tue Jan 05 2021 00:00:00 GMT-0600 (hora estándar central)
  ordinal_time = (((date_final - date_init)) / 864)//convertimos a milisegundos y restamos des pues dividimos por el facto de 864
  return Math.floor(ordinal_time) // eliminamos punto decimal
}

