import UserCollection from '../../src/models/User';
import TaskCollection from '../../src/models/Task';

import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const user1Id = new mongoose.Types.ObjectId();
const user2Id = new mongoose.Types.ObjectId();

export const users = [
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
  },
  {
    _id: user2Id,
    name: 'Name 2',
    email: 'email2@example.com',
    password: 'password2',
    tokens: [
      {
        token: jwt.sign(
          { _id: user2Id },
          process.env.JWT_SECRET || 'd^e#f@a*u$l%t'
        )
      }
    ]
  }
];

export const tasks = [
  {
    description: 'Description 1',
    completed: false,
    owner: user1Id
  },
  {
    description: 'Description 2',
    completed: true,
    owner: user1Id
  },
  {
    description: 'Description 3',
    completed: true,
    owner: user2Id
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
