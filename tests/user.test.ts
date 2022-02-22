import app from '../src/app';

import request from 'supertest';

test('Should sign up a new user', async () => {
  await request(app)
    .post('/api/v1/users')
    .send({
      name: 'Test Name',
      email: 'testemail@example.com',
      password: 'testpassword123'
    })
    .expect(201);
});
