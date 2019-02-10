const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const api = require('./routes/api');
const Pusher = require('pusher');

const pusher = new Pusher({
  appId: '710110',
  key: '0a9b71501c34687037ae',
  secret: '681963cb67e64b88b908',
  cluster: 'us2',
  encrypted: true
});
const channel = 'tasks';

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', api);

const MONGODB_URI = "mongodb://heroku_f50dbbld:2im9bqug2amnj946kggv357ofk@ds329975-a0.mlab.com:29975,ds329975-a1.mlab.com:29975/heroku_f50dbbld?replicaSet=rs-ds329975"
console.log(MONGODB_URI)

// mongoose.connect('mongodb://localhost/tasksDb?replicaSet=rs');
mongoose.connect(process.env.MONGODB_URI || MONGODB_URI)

pusher.trigger('my-channel', 'my-event', {
  "message": "hello world"
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection Error:'));

db.once('open', () => {
  app.listen(9000, () => {
    console.log('Node server running on port 9000');
  });

  const taskCollection = db.collection('tasks');
  const changeStream = taskCollection.watch();

  changeStream.on('change', (change) => {
    console.log(change);
      
    if(change.operationType === 'insert') {
      const task = change.fullDocument;
      pusher.trigger(
        channel,
        'inserted', 
        {
          id: task._id,
          task: task.task,
        }
      ); 
    } else if(change.operationType === 'delete') {
      pusher.trigger(
        channel,
        'deleted', 
        change.documentKey._id
      );
    } else if (change.operationType){
      console.log("Connection")
    }
  });
});

