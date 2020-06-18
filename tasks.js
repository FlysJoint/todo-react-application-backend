const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "todo"
});

app.get("/tasks", function(req, res) {
  const query = "SELECT * FROM Task;"

  connection.query(query, function(err, data) {
    if (err) {
      console.log("Error fetching tasks", err);
      res.status(500).json({
        error: err
      });
    } else {
      res.json({
        tasks: data
      });
    }
  });
});

app.post("/tasks", function(req, res) {
  const query = "INSERT INTO Task (text, bottle, shelf, isCompleted, pos, username) VALUES (?, ?, ?, ?, ?, ?);";
  const querySelect = "SELECT * FROM Task WHERE taskID = ?";

  connection.query(query, [req.body.text, req.body.bottle, req.body.shelf, req.body.isCompleted, req.body.pos, req.body.username], function(error, data) {
    if(error) {
      console.log("Error adding a task", error);
      res.status(500).json({
        error: error
      })
    } else {
      connection.query(querySelect, [data.insertId], function(error, data) {
        if(error) {
          console.log("Error getting the task", error);
          res.status(500).json({
            error: error
          })
        } else {
          res.status(201).json({
            task: data
          })
        }
      })
    }
  })
});

app.put('/tasks/:taskID', function(req, res) {
  const query = "UPDATE Task SET text = ?, shelf = ?, bottle = ?, isCompleted = ?, pos = ?, username = ? WHERE taskID = ?;";
  const querySelect = "SELECT * FROM Task WHERE taskID = ?";

  connection.query(query, [req.body.text, req.body.shelf, req.body.bottle, req.body.isCompleted, req.body.pos, req.body.username, req.params.taskID], function(error, data) {
    if(error) {
      console.log("Error updating a task", error);
      res.status(500).json({
        error: error
      })
    } else {
      connection.query(querySelect, [req.params.taskID], function(error, data) {
        if(error) {
          console.log("Error getting the task", error);
          res.status(500).json({
            error: error
          })
        } else {
          res.status(200).json({
            task: data
          })
        }
      })
    }
  })
});

app.delete('/tasks/:taskID', function(req, res) {
  const query = "DELETE FROM Task WHERE taskID = ?;";
  const querySelect = "SELECT * FROM Task"; // to verify its deleted, printing them all out seems like overkill though

  connection.query(query, [req.params.taskID], function(error, data) {
    if(error) {
      console.log("Error deleting a task", error);
      res.status(500).json({
        error: error
      })
    } else {
      connection.query(querySelect, function(error, data) {
        if(error) {
          console.log("Error getting the task", error);
          res.status(500).json({
            error: error
          })
        } else {
          res.status(200).json({
            task: data
          })
        }
      })
    }
  })
});



module.exports.handler = serverless(app);
