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
var selectOneQuery = "select * from chores where id = ?";
var insertQuery = "insert into chores (choreName, assigned, recurrence, complete) values(?, ?, ?, ?)";
var updateQuery = "update chores set choreName = ?, assigned = ?, recurrence = ?, complete = ? where id = ?";
var deleteQuery = "delete from chores where id = ?";

router.route("/chores").get(function(req, res) {
  connection.query(selectAllQuery, ["chores"], function(err, rows, fields) {
    if (err) throw err;
    res.status(200).send(rows);
  });
}).post(urlencoded, function(req, res) {
  var choreName = req.body.choreName;
  var assigned = req.body.assigned;
  var recurrence = req.body.recurrence;
  var complete = req.body.complete;

  connection.query(insertQuery, [choreName, assigned, recurrence, complete], function(err, rows, fields) {
    if (err) throw err;
    res.status(200).send("Successfully added the chore!");
  });
});

router.route("/chores/:id").get(function(req, res) {
  var id = parseInt(req.params.id);

  connection.query(selectOneQuery, [id], function(err, rows, fields) {
    if (err) throw err;
    if (rows.length === 0) {
      res.status(404).send("Couldn’t find a chore with the specified ID");
    } else {
      res.status(200).send(rows[0]);
    }
  });
}).put(urlencoded, function(req, res) {
  var id = parseInt(req.params.id);
  var choreName = req.body.choreName;
  var recurrence = req.body.recurrence;
  var assigned = req.body.assigned;
  var complete = req.body.complete;
  
  connection.query(updateQuery, [choreName, assigned, recurrence, complete, id], function(err, rows, fields){
    if(err) throw err;
    if(rows.affectedRows === 0){
      res.status(404).send("Couldn’t update the chore based on the specified ID");
    } else {
      res.status(200).send("Successfully updated the chore!");
    }
  });
}).delete(function(req, res){
  var id = parseInt(req.params.id);
  
  connection.query(deleteQuery, [id], function(err, rows, fields){
    if(err) throw err;
    if(rows.affectedRows === 0){
      res.status(404).send("Couldn’t update a chore based on the specified ID");
    } else {
      res.status(200).send("Chore successfully removed");
    }
  });
});

module.exports = router;