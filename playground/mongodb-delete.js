const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err) return console.log('Unable to connect MongoDB Server.');
  console.log('Connected to MongoDB Server.');

  // deletemany
  // db.collection('Todos').deleteMany({ text: 'some task to do'}).then((result) => {
  //   console.log(result);
  // });
  // deleteone
  // db.collection('Todos').deleteOne({ text: 'some task to do' }).then((result) => {
  //   console.log(result);
  // })
  // findoneanddeleteone
  // db.collection('Todos').findOneAndDelete({ completed: true }).then((result) => {
  //   console.log(result);
  // })

  // db.collection('Users').deleteMany({ name: 'Akkiro' }).then((result) => {
  //   console.log(result.result);
  // });
  db.collection('Users').deleteOne({ _id: new ObjectID('5b9cb91347ce8f1e6c155910') }).then((result) => {
    console.log(result.result);
  });


  // db.close();
});
