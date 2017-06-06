//Set our required dependencies and app instance
var express = require("express");
var chores = require("./api/chores");
var groceries = require("./api/groceries");
var app = express();

//Mount our middleware and set our API end points. 
//We also specify our extension so they don't appear in the URL
app.use(express.static("public", {
  extensions: ["html"]
}));

//Specify our static API documentation which will be access via /swagger endpoint
app.use("/swagger", express.static("swagger",{
  extensions: ["html", "json"]
}));

app.use("/api", chores);
app.use("/api", groceries);

//Set our port to listen
app.listen(3000, function() {
  console.log("Magic is happening on port 3000");
});