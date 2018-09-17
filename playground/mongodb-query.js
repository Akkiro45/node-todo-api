const {ObjectID} = require('mongodb');

const {User} = require('./../server/models/user');
const {mongoose} = require('./../server/db/mongoose');

User.findById('5b9e2d44453c3e4020d27bb4').then((user) => {
  if(!user) {
    return console.log('There is no such user!');
  }
  console.log(JSON.stringify(user, undefined, 2));
}).catch((e) => console.log('Invalid id'));
