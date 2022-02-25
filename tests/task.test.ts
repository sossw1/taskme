import app from '../src/app';
import TaskCollection from '../src/models/Task';
import { dbSeed, dbClose, testUser1 } from './fixtures/db';

import request from 'supertest';

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
  const response = await request(app)
    .post('/api/v1/tasks')
    .set('Authorization', `Bearer ${testUser1.tokens[0].token}`)
    .send(testTask1)
    .expect(201);

  const task = await TaskCollection.findById(response.body._id);
  expect(task).not.toBeNull();
  if (task) {
    expect(task.description).toEqual(testTask1.description);
    expect(task.completed).toEqual(false);
    expect(task.owner).toEqual(testUser1._id);
  }
});
