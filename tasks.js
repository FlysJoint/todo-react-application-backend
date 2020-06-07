const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/tasks', function(req, res) {
  res.status(200).send({ 
    "text": "watch the api webinar until I get it",
    "shelf": "morning",
    "bottle": 1,
    "pos": 0,
    "isCompleted": false,
    "taskID": 7
  });
});

app.post('/tasks', function(req, res) {
  const text = req.body.text;
  const taskID = req.body.taskID;
  const shelf = req.body.shelf;
  const bottle = req.body.bottle;
  const isCompleted = req.body.isCompleted;
  const pos = req.body.pos;

  res.status(201).json({
    message: `Received a request to add task '${text}' on the '${shelf}' shelf`
  });
});

app.put('/tasks/:taskID', function(req, res) {
  const taskID = req.params.taskID;

  res.status(200).json({
    message: `You issued a put request for ID: ${taskID}`
  });
});

app.delete('/tasks/:taskID', function(req, res) {
  const taskID = req.params.taskID;

  res.status(200).json({
    message: `You issued a delete request for ID: ${taskID}`
  });
});

module.exports.handler = serverless(app);
