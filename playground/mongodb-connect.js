// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

// const id = new ObjectID();

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err) {
    return console.log('Unable to connect MongoDB server!');
  }
  console.log('Connected to MongoDB Server!');
  // db.collection('Todos').insertOne({
  //   text: 'Some text',
  //   completed: false
  // }, (err , result) => {
  //   if(err) {
  //     return console.log('Unable to insert into todo. ', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // db.collection('Users').insertOne({
  //   name: 'Akkiro',
  //   age: 20,
  //   location: 'Mumbai'
  // }, (err, result) => {
  //   if(err){
  //     return console.log('Unable to insert into Users. ', err);
  //   }
  //   console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
  // });
  db.close();
});
