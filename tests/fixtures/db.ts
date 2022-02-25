import UserCollection from '../../src/models/User';
import TaskCollection from '../../src/models/Task';

import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const user1Id = new mongoose.Types.ObjectId();
const user2Id = new mongoose.Types.ObjectId();

export const user1 = {
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
};

export const user2 = {
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
};

export const task1 = {
  description: 'Description 1',
  completed: false,
  owner: user1._id
};

export const task2 = {
  description: 'Description 2',
  completed: true,
  owner: user1._id
};

export const task3 = {
  description: 'Description 3',
  completed: true,
  owner: user2._id
};

export const dbSeed = async () => {
  await TaskCollection.deleteMany();
  await UserCollection.deleteMany();
  await new UserCollection(user1).save();
  await new UserCollection(user2).save();
  await new TaskCollection(task1).save();
  await new TaskCollection(task2).save();
  await new TaskCollection(task3).save();
};

export const dbClose = async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
};
