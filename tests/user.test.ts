import app from '../src/app';
import UserCollection from '../src/models/User';
import { users, dbSeed, dbClose } from './fixtures/db';

import request from 'supertest';

beforeEach(async () => {
  await dbSeed();
});

afterAll(async () => {
  await dbClose();
});

test('Should sign up a new user', async () => {
  const newUser = {
    name: 'New User',
    email: 'newuser@example.com',
    password: 'newuser'
  };

  const response = await request(app)
    .post('/api/v1/users')
    .send(newUser)
    .expect(201);

  const user = await UserCollection.findById(response.body.user._id);
  expect(user).not.toBeNull();

  if (user) {
    expect(response.body).toMatchObject({
      user: {
        name: newUser.name,
        email: newUser.email
      },
      token: user.tokens[0].token
    });

    expect(user.password).not.toEqual(newUser.password);
  }
});

test('Should log in existing user', async () => {
  const response = await request(app)
    .post('/api/v1/users/login')
    .send({
      email: users[1].email,
      password: users[1].password
    })
    .expect(200);

  const user = await UserCollection.findById(users[1]._id);
  expect(user).not.toBeNull();
  if (user) {
    expect(user.tokens[1].token).toEqual(response.body.token);
  }
});

test('Should not log in nonexistent user', async () => {
  await request(app)
    .post('/api/v1/users/login')
    .send({
      email: users[1].email,
      password: 'wrongpassword'
    })
    .expect(400);
});

test('Should get profile for user', async () => {
  await request(app)
    .get('/api/v1/users/me')
    .set('Authorization', `Bearer ${users[1].tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
  await request(app).get('/api/v1/users/me').send().expect(401);
});

test('Should delete account for user', async () => {
  await request(app)
    .delete('/api/v1/users/me')
    .set('Authorization', `Bearer ${users[1].tokens[0].token}`)
    .send()
    .expect(200);

  const user = await UserCollection.findById(users[1]._id);
  expect(user).toBeNull();
});

test('Should not delete account for unauthenticated user', async () => {
  await request(app).delete('/api/v1/users/me').send().expect(401);
});

test('Should upload avatar image', async () => {
  await request(app)
    .post('/api/v1/users/me/avatar')
    .set('Authorization', `Bearer ${users[1].tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200);

  const user = await UserCollection.findById(users[1]._id);
  expect(user).not.toBeNull();
  if (user) {
    expect(user.avatar).toEqual(expect.any(Buffer));
  }
});

test('Should update valid user field', async () => {
  await request(app)
    .patch('/api/v1/users/me')
    .set('Authorization', `Bearer ${users[1].tokens[0].token}`)
    .send({
      name: 'Modified'
    })
    .expect(200);

  const user = await UserCollection.findById(users[1]._id);
  expect(user).not.toBeNull();

  if (user) {
    expect(user.name).toEqual('Modified');
  }
});

test('Should not update invalid user field', async () => {
  await request(app)
    .patch('/api/v1/users/me')
    .set('Authorization', `Bearer ${users[1].tokens[0].token}`)
    .send({
      location: 'London'
    })
    .expect(400);
});
