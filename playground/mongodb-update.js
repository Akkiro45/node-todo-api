const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err) return console.log('Unable to connect MongoDB Server.');
  console.log('Connecte to MongoDB Server.');

  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectID('5b9cb575dd2bcb1648e1ab42')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5b9cb955f1263b3720536731')
  }, {
    $set: {
      name: 'MSD'
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: true
  }).then((result) => {
    console.log(result);
  });
  // db.close();
});
