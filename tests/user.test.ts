import app from '../src/app';

import mongoose from 'mongoose';
import request from 'supertest';
import UserCollection from '../src/models/User';

const testUser1 = new UserCollection({
  name: 'Test Name',
  email: 'testemail@example.com',
  password: 'testpassword123'
});

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
