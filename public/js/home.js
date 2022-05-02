$("#btn").on("click", search);

async function search(){
  let city = $("#city").val();
  console.log(city);
  
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=7c47a9cb28226970baecc3472821dafc&units=imperial`;
  let data = await getData(url);
  console.log(data); 
  let val = validateForm(city, data['cod']); 
  if(val == 1){
    $("#error").html("");
    $("#temp").html(`${data['main']['temp']} °F`);

    $("#forecast").html(` ${data['weather'][0]['main']}`);
    let weather = $(data['main']['temp']).val();
    console.log(weather);
  }
  if("#temp" > 50){
    console.log("cold");
  }

}


function validateForm(city, cityError){
  if(city.length < 3){
		alert("City Name must be longer!");
    return 0;
  }
  else{
    if(cityError == "404"){
      $("#error").html("City name is invalid");
      $("#error").css("color", "red");
      return 0;
    }else
    {
      $("#error").html("");
      return 1;
    }
  }
}

async function getData(url){
  let response = await fetch(url);
  let data = await response.json();
  return data;
}
window.onload;