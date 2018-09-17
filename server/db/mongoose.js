const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');
mongoose.connect('mongodb://akshay:Akkiro@45@ds161062.mlab.com:61062/node-todoappv01' || 'mongodb://localhost:27017/TodoApp');

module.exports = {
  mongoose
}
