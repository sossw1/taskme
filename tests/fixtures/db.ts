import UserCollection from '../../src/models/User';

import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const testUser1Id = new mongoose.Types.ObjectId();

const testUser1 = {
  _id: testUser1Id,
  name: 'Test Name',
  email: 'testemail@example.com',
  password: 'testpassword123',
  tokens: [
    {
      token: jwt.sign(
        { _id: testUser1Id },
        process.env.JWT_SECRET || 'd^e#f@a*u$l%t'
      )
    }
  ]
};

const dbSeed = async () => {
  await UserCollection.deleteMany();
  await new UserCollection(testUser1).save();
};

const dbClose = async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
};

export { testUser1, dbSeed, dbClose };
