const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req,res){
  res.render("home");
});

app.post("/", function(req,res){
  const city = req.body.cityName;
  const apiKey = "e325cd22c3b1634345277e16574a7f68"
  const unit = "metric"

  const url = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apiKey+"&units="+unit;

  https.get(url, function(response){
    const r = response.statusCode;

    if(r == 404){
      res.render("notweather", {cityName: city});
    } else {
        response.on("data", function(data){
          const weatherData = JSON.parse(data);
          const cityName = weatherData.name;
          const temp = weatherData.main.temp;
          const icon = weatherData.weather[0].icon;
          const imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png"
          res.render("weather",{cityName: cityName, temperature: temp, imgURL: imageURL});
        })
      }
  })
});

app.listen(3000, function(){
    console.log("Server up and running on port 3000..")
})
