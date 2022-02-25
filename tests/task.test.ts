import app from '../src/app';
import TaskCollection from '../src/models/Task';
import { dbSeed, dbClose, user1, task1 } from './fixtures/db';

import request from 'supertest';

beforeAll(async () => {
  await dbSeed();
});

afterAll(async () => {
  await dbClose();
});

test('Should create task for user', async () => {
  const task4 = {
    description: 'Description 4',
    completed: false,
    owner: user1
  };

  const response = await request(app)
    .post('/api/v1/tasks')
    .set('Authorization', `Bearer ${user1.tokens[0].token}`)
    .send(task4)
    .expect(201);

  const task = await TaskCollection.findById(response.body._id);
  expect(task).not.toBeNull();
  if (task) {
    expect(task.description).toEqual(task4.description);
    expect(task.completed).toEqual(false);
    expect(task.owner).toEqual(user1._id);
  }
});
