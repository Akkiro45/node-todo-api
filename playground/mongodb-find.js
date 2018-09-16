const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err) {
    return console.log('Unable to connect to MongoDB server!');
  }
  console.log('Connected to MongoDB server!');
  // db.collection('Todos').find({_id: new ObjectID('5b9cb575dd2bcb1648e1ab42')}).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fetch todos! ', err);
  // });
  db.collection('Todos').find().count().then((count) => {
    console.log('Todos count: ', count);
  });
  db.collection('Users').find({name: 'Akkiro'}).toArray().then((docs) => {
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch Todos. ', err);
  });
  // db.close();
});
