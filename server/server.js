require('./config/config.js');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text
  });
  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;
  if(!ObjectID.isValid(id)) {
    return res.status(400).send(id + " is not valid ID.");
  }
  Todo.findById(id).then((todo) => {
    if(!todo) return res.status(404).send(id + " Dose not exist.");
    res.status(200).send({todo});
  }).catch((e) => res.status(400).send("ERROR"));
});

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  if(!ObjectID.isValid(id)) {
    return res.status(400).send(id + ' is not valid ID.');
  }
  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo) return res.status(404).send(id + ' Doen not exist.');
    res.status(200).send({todo});
  }).catch((e) => res.status(400).send('ERROR'));
});

app.patch('/todos/:id', (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['text', 'completed']);
  if(!ObjectID.isValid(id)) {
    return res.status(400).send(id + ' is not valid ID.');
  }
  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    if(!todo) {
      return res.status(404).send("Todo does not found!");
    }
    res.status(200).send({todo});
  }).catch((e) => {
    res.status(400).send('ERROR');
  })
});

// app.post('/users', (req, res) => {
//   const body = _.pick(req.body, ['email', 'password']);
//   let user = new User(body);
//   let check = false;
//   user.save().then(() => {
//     return user.generateAuthToken();
//   }).then((token) => {
//     res.header('x-auth', token).send(user);
//   }).catch((e) => {
//     res.status(400).send(e);
//   });
//   // user.save().then((user) => {
//   //   user = user;
//   //   check = true;
//   // }).catch((e) => {
//   //   res.status(400).send(e);
//   // });
//   // if(check) {
//   //   user.generateAuthToken().then((token) => {
//   //     res.header('x-auth', token).send(user);
//   //   }).catch((e) => {
//   //     res.status(400).send(e);
//   //   });
//   // }
//
// });

app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    // user = user.toJSON();
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

module.exports = {
  app
};
