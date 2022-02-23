import app from '../src/app';
import UserCollection from '../src/models/User';

import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import request from 'supertest';

const testUser1Id = new mongoose.Types.ObjectId();

const testUser1 = {
  _id: testUser1Id,
  name: 'Test Name',
  email: 'testemail@example.com',
  password: 'testpassword123',
  tokens: [
    {
      token: jwt.sign(
        { _id: testUser1Id },
        process.env.JWT_SECRET || 'd^e#f@a*u$l%t'
      )
    }
  ]
};

beforeEach(async () => {
  await UserCollection.deleteMany();
  await new UserCollection(testUser1).save();
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

test('Should sign up a new user', async () => {
  await request(app)
    .post('/api/v1/users')
    .send({
      name: 'Test Name 2',
      email: 'testemail2@example.com',
      password: 'testpassword123'
    })
    .expect(201);
});

test('Should log in existing user', async () => {
  await request(app)
    .post('/api/v1/users/login')
    .send({
      email: testUser1.email,
      password: testUser1.password
    })
    .expect(200);
});

test('Should not log in nonexistent user', async () => {
  await request(app)
    .post('/api/v1/users/login')
    .send({
      email: testUser1.email,
      password: 'wrongpassword'
    })
    .expect(400);
});

test('Should get profile for user', async () => {
  await request(app)
    .get('/api/v1/users/me')
    .set('Authorization', `Bearer ${testUser1.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
  await request(app).get('/api/v1/users/me').send().expect(401);
});
