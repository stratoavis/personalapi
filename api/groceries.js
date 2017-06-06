var router = require("express").Router();
var bodyParser = require("body-parser");
var urlencoded = bodyParser.urlencoded({
  extended: true
});

var mysql = require("mysql");
var db = require("../conf/dbconf");

var connection = mysql.createConnection({
  host: db.database.host,
  user: db.database.user,
  password: db.database.password,
  database: db.database.dbname
});

var selectAllQuery = "select * from ??";
var selectOneQuery = "select * from groceries where id = ?";
var insertQuery = "insert into groceries (groceryName, quantity, location) values(?, ?, ?)";
var updateQuery = "update groceries set groceryName = ?, quantity = ?, location = ? where id = ?";
var deleteQuery = "delete from groceries where id = ?";
var deleteAllQuery = "delete from groceries";

//Base URL routes
router.route("/groceries").get(function(req, res) {
  connection.query(selectAllQuery, ["groceries"], function(err, rows, fields) {
    if (err) throw err;
    res.status(200).send(rows);
  });
}).post(urlencoded, function(req, res) {

  var groceryName = req.body.groceryName;
  var quantity = parseInt(req.body.quantity);
  var location = req.body.location;

  connection.query(insertQuery, [groceryName, quantity, location], function(err, rows, fields) {
    if (err) throw err;
    res.status(200).send("Successfully added a new grocery item!");
  });
}).delete(function(req, res) {
  connection.query(deleteAllQuery, function(err, rows, fields) {
    if (err) throw err;
    res.status(200).send("Successfully cleared the grocery list");
  });
});

//Grocery route passing an ID in the URI
router.route("/groceries/:id").get(function(req, res) {
  var id = parseInt(req.params.id);

  connection.query(selectOneQuery, [id], function(err, rows, fields) {
    if (err) throw err;

    //Because we're getting data via queries, the returned array should populate
    if (rows.length === 0) {
      res.status(404).send("Unable to find grocery item");
    } else {
      res.status(200).send(rows[0]); //We only need the returned object, not the array :) 
    }
  });
}).put(urlencoded, function(req, res) {
  var groceryName = req.body.groceryName;
  var quantity = parseInt(req.body.quantity);
  var location = req.body.location;
  var id = parseInt(req.params.id);

  connection.query(updateQuery, [groceryName, quantity, location, id], function(err, rows, fields) {
    if (err) throw err;

    //Because this is not returning an array, we can use the affectedRows property to check if it worked or not
    if (rows.affectedRows === 0) {
      res.status(404).send("Couldn't find a grocery item with that ID");
    } else {
      res.status(200).send("Updated grocery item successfully!");
    }
  });
}).delete(function(req, res) {
  var id = parseInt(req.params.id);

  connection.query(deleteQuery, [id], function(err, rows, fields) {
    if (err) throw err;

    if (rows.affectedRows === 0) {
      res.status(404).send("Couldn't find the specified grocery item to remove");
    } else {
      res.status(200).send("Grocery item successfully removed!");
    }
  });
});

module.exports = router;