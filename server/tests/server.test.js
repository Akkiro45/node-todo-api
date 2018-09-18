const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {Todo} = require('./../models/todo');
const {app} = require('./../server');

const todos = [{
  _id: new ObjectID(),
  text: 'First todo'
}, {
  _id: new ObjectID(),
  text: 'Seconf todo'
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo.', (done) => {
    const text = 'Some test text';
    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      })
  });

  it('should not create todo with invalid data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err) return done(err);
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2)
          done();
        }).catch((e) => done(e));
      })
  });
});

describe('GET /todos', () => {
  it('should retuen array of todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos).toBeA('array');
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/id', () => {
  it('should return todo', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });
  it('should return 400', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}9`)
      .expect(400)
      .end(done);
  });
  it('should return 404', (done) => {
    request(app)
      .get('/todos/5b9f98f9eb3958742c4aa3d2')
      .expect(404)
      .end(done);
  });

});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    request(app)
      .delete(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });
  it('should return 404 if id doent exist', (done) => {
    request(app)
      .delete(`/todos/5b9f98f9eb3958742c4aa3d2`)
        .expect(404)
        .end(done);
  });
  it('should return 400', (done) => {
    request(app)
      .delete(`/todos/${todos[0]._id.toHexString()}t`)
      .expect(400)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  const todo = {
    text: 'changed todo',
    completed: true
  }
  const todo1 = {
    text: 'test todo',
    completed: false
  }
  it('should update todo', (done) => {
    request(app)
      .patch(`/todos/${todos[0]._id.toHexString()}`)
      .send(todo)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todo.text);
        expect(res.body.todo.completed).toBe(todo.completed);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);

  });
  it('should clear completedAt when completed is false', (done) => {
    request(app)
      .patch(`/todos/${todos[0]._id.toHexString()}`)
      .send(todo1)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(false)
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });
});
