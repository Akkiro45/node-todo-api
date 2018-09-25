require('./config/config.js');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });
  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({ _creator: req.user._id }).then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;
  if(!ObjectID.isValid(id)) {
    return res.status(400).send(id + " is not valid ID.");
  }
  Todo.findOne({ _id: id, _creator: req.user._id}).then((todo) => {
    if(!todo) return res.status(404).send(id + " Dose not exist.");
    res.status(200).send({todo});
  }).catch((e) => res.status(400).send("ERROR"));
});

app.delete('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;
  if(!ObjectID.isValid(id)) {
    return res.status(400).send(id + ' is not valid ID.');
  }
  Todo.findOneAndRemove({ _id: id, _creator: req.user._id }).then((todo) => {
    if(!todo) return res.status(404).send(id + ' Doen not exist.');
    res.status(200).send({todo});
  }).catch((e) => res.status(400).send('ERROR'));
});

app.patch('/todos/:id', authenticate, (req, res) => {
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
  Todo.findOneAndUpdate({ _id: id, _creator: req.user._id }, {$set: body}, {new: true}).then((todo) => {
    if(!todo) {
      return res.status(404).send("Todo does not found!");
    }
    res.status(200).send({todo});
  }).catch((e) => {
    res.status(400).send('ERROR');
  })
});

app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  const userObj = _.pick(req.body, ['email', 'password'])
  User.findOne({email: userObj.email}).then((doc) => {
    bcrypt.compare(userObj.password, doc.password, (err, r) => {
      if(err) {
        return res.status(400).send('Invalid Password.');
      }
      if(r) {
        doc.generateAuthToken().then((token) => {
              res.header('x-auth', token).send(doc);
            });
        // res.header('x-auth', doc.tokens[0].token).send(doc);
      } else {
        res.status(401).send('Incorect password.');
      }
    })
  }).catch((e) => {
    res.status(400).send('Invalid email.');
  });
});

// app.post('/users/login', (req, res) => {
//   const body = _.pick(req.body, ['email', 'password']);
//   User.findByCredentials(body.email, body.password).then((user) => {
//     user.generateAuthToken().then((token) => {
//       res.header('x-auth', token).send(user);
//     });
//   }).catch((e) => {
//     res.status(400).send('Invalid email or password!');
//   });
// });

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, (e) => {
    res.status(400).send();
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

module.exports = {
  app
};
