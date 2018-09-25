const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {app} = require('./../server');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo.', (done) => {
    const text = 'Some test text';
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(typeof res.body.todos).toBe('object');
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/id', () => {
  it('should return todo', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });
  it('should not return todo created by other user', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
  it('should return 400', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}9`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(400)
      .end(done);
  });
  it('should return 404', (done) => {
    request(app)
      .get('/todos/5b9f98f9eb3958742c4aa3d2')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    request(app)
      .delete(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });
  it('should not remove a todo by other user', (done) => {
    request(app)
      .delete(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
  it('should return 404 if id doent exist', (done) => {
    request(app)
      .delete(`/todos/5b9f98f9eb3958742c4aa3d2`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
  it('should return 400', (done) => {
    request(app)
      .delete(`/todos/${todos[0]._id.toHexString()}t`)
      .set('x-auth', users[0].tokens[0].token)
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
      .set('x-auth', users[0].tokens[0].token)
      .send(todo)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todo.text);
        expect(res.body.todo.completed).toBe(todo.completed);
        // expect(res.body.todo.completedAt).toBeA('number');
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end(done);

  });
  it('should not update todo by other user', (done) => {
    request(app)
      .patch(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[1].tokens[0].token)
      .send(todo)
      .expect(404)
      .end(done);

  });
  it('should clear completedAt when completed is false', (done) => {
    request(app)
      .patch(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .send(todo1)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(false)
        expect(res.body.todo.completedAt).toBeFalsy();
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe(users[0].email);
        expect(res.body._id).toBe(users[0]._id.toHexString());
      })
      .end(done);
  });
  it('should return 401 if user is not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create user', (done) => {
    const user = {
      email: 'testing@test.com',
      password: 'password'
    }
    request(app)
      .post('/users')
      .send(user)
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body.email).toBe(user.email);
        expect(res.body._id).toBeTruthy();
      })
      .end((err) => {
        if(err) {
          return end(err);
        }
        User.findOne({email: user.email}).then((doc) => {
          expect(doc).toBeTruthy();
          expect(doc.password).not.toBe(user.password);
          done();
        }).catch((e) => done(e));
      });
  });
  it('should return validation error if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({email: 'dsi', password: 'shsssss'})
      .expect(400)
      .end(done);
  });
  it('should not create user if email already in use', (done) => {
    request(app)
      .post('/users')
      .send({email: 'test1@test.com', password: 'shsssss'})
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return token', (done) => {
    request(app)
      .post('/users/login')
      .send({email: users[0].email, password: users[0].password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err) => {
        if(err) {
          return done(err);
        }
        User.findOne({email: users[0].email}).then((user) => {
          expect(user.toObject().email).toBe(users[0].email);
          expect(user.toObject().password).not.toBe(users[0].passwors);
          done();
        }).catch((e) => done(e));
      });
  });
  it('should reject user if invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({email: 'sss', password: 'sjsjks'})
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end(done);
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err) => {
        if(err) return done(err);
        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        })
      });
  });
});
