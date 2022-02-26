import UserCollection from '../../src/models/User';
import TaskCollection from '../../src/models/Task';

import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const user0Id = new mongoose.Types.ObjectId();
const user1Id = new mongoose.Types.ObjectId();
const task0Id = new mongoose.Types.ObjectId();
const task1Id = new mongoose.Types.ObjectId();
const task2Id = new mongoose.Types.ObjectId();

export const users = [
  {
    _id: user0Id,
    name: 'Name 0',
    email: 'email0@example.com',
    password: 'password0',
    tokens: [
      {
        token: jwt.sign(
          { _id: user0Id },
          process.env.JWT_SECRET || 'd^e#f@a*u$l%t'
        )
      }
    ]
  },
  {
    _id: user1Id,
    name: 'Name 1',
    email: 'email1@example.com',
    password: 'password1',
    tokens: [
      {
        token: jwt.sign(
          { _id: user1Id },
          process.env.JWT_SECRET || 'd^e#f@a*u$l%t'
        )
      }
    ]
  }
];

export const tasks = [
  {
    _id: task0Id,
    description: 'Description 0',
    completed: false,
    owner: user0Id
  },
  {
    _id: task1Id,
    description: 'Description 1',
    completed: true,
    owner: user0Id
  },
  {
    _id: task2Id,
    description: 'Description 2',
    completed: true,
    owner: user1Id
  }
];

export const dbSeed = async () => {
  await TaskCollection.deleteMany();
  await UserCollection.deleteMany();
  users.forEach(async (user) => {
    await new UserCollection(user).save();
  });
  tasks.forEach(async (task) => {
    await new TaskCollection(task).save();
  });
};

export const dbClose = async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
};
