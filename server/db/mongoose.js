const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// const mLabURI = 'mongodb://akshay:Akkiro@45@ds161062.mlab.com:61062/node-todoappv01';
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');
mongoose.connect('mongodb://localhost:27017/TodoApp')
  .then(() => {
      console.log('Connected to MongoDB Server.');
    }).catch((e) => {
      console.log('Unable to connect to MongoDB Server.');
    });

module.exports = {
  mongoose
}
