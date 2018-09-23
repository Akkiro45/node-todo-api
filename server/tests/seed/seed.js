const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  email: 'test1@test.com',
  password: 'pass@1234',
  tokens: [{
    access: 'auth',
    token: jwt.sign({userOneId, access: 'auth'}, 'rohitsharma')
  }]
}, {
  _id: userTwoId,
  email: 'tset2@test.com',
  password: 'password123'
}];

const todos = [{
  _id: new ObjectID(),
  text: 'First todo'
}, {
  _id: new ObjectID(),
  text: 'Seconf todo'
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    return Promise.all([userOne, userTwo]);
  }).then(() => done()).catch((e) => console.log(e));
}

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
};
