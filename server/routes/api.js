const Task  = require('../models/task');
const express = require('express');
const router = express.Router();

/* CREATE */
router.post('/new', (req, res) => {
  Task.create({
    task: req.body.task,
  }, (err, task) => {
    if (err) {
      console.log('CREATE Error: ' + err);
      res.status(500).send('Error');
    } else {
      res.status(200).json(task);
    }
  });
});

router.route('/:id')
  /* DELETE */
  .delete((req, res) => {
    Task.findById(req.params.id, (err, task) => {
      if (err) { 
        console.log('DELETE Error: ' + err);
        res.status(500).send('Error');
      } else if (task) {
        task.remove( () => {
          res.status(200).json(task);
        });
     } else {
        res.status(404).send('Not found');
      }
    });
  });

/* FIND ALL */
router.get("/tasks", (req,res) => {
  console.log(req.query)
    Task.find(req.query,(err,task) => {
      if (err){
        console.log('Error Getting Tasks: ' + err);
        res.status(500).send('Error');
      } else if (task) {
        console.log(task)
        res.status(200).json(task);
      } else {
        res.status(404).send('Not found');
      }
    })
        // .sort({date:-1})
        // .then(dbTask => res.json(dbTask))
        // .catch(err => res.status(422).json(err))
  })

module.exports = router;