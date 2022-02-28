import app from '../src/app';
import TaskCollection from '../src/models/Task';
import { dbSeed, dbClose, users, tasks } from './fixtures/db';
import { apiVersion } from '../src/routes/api/version';

import request from 'supertest';

beforeEach(async () => {
  await dbSeed();
});

afterAll(async () => {
  await dbClose();
});

test('Should create task for user', async () => {
  const newTask = {
    description: 'New Task',
    completed: false,
    owner: users[0]
  };

  const response = await request(app)
    .post(`/api/${apiVersion}/tasks`)
    .set('Authorization', `Bearer ${users[0].tokens[0].token}`)
    .send(newTask)
    .expect(201);

  const task = await TaskCollection.findById(response.body._id);
  expect(task).not.toBeNull();
  if (task) {
    expect(task.description).toEqual(newTask.description);
    expect(task.completed).toEqual(false);
    expect(task.owner).toEqual(users[0]._id);
  }
});

test('Should get tasks belonging to user', async () => {
  const response = await request(app)
    .get(`/api/${apiVersion}/tasks`)
    .set('Authorization', `Bearer ${users[0].tokens[0].token}`)
    .send()
    .expect(200);

  const user0Tasks = tasks.filter((task) => {
    return task.owner === users[0]._id;
  });

  expect(response.body).toHaveLength(user0Tasks.length);
});

test('Should not delete task belonging to other user', async () => {
  const taskId = tasks[0]._id;
  const response = await request(app)
    .delete(`/api/${apiVersion}/tasks/${taskId}`)
    .set('Authorization', `Bearer ${users[1].tokens[0].token}`)
    .send()
    .expect(404);

  const task = await TaskCollection.findById(taskId);
  expect(task).not.toBeNull();
});
