import app from '../src/app';

import request from 'supertest';
import { dbSeed, dbClose, testUser1 } from './fixtures/db';

const testTask1 = {
  description: 'Test Task'
};

beforeAll(async () => {
  await dbSeed();
});

afterAll(async () => {
  await dbClose();
});

test('Should create task for user', async () => {
  await request(app)
    .post('/api/v1/tasks')
    .set('Authorization', `Bearer ${testUser1.tokens[0].token}`)
    .send(testTask1)
    .expect(201);
});
