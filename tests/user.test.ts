import app from '../src/app';

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
