import UserCollection from '../../models/User';
import { Express, Request, Response } from 'express';

interface User {
  name: string;
  email: string;
  password: string;
  age: number;
}

export default (app: Express) => {
  app.post('/api/v1/users', (req: Request, res: Response) => {
    const { name, email, password, age } = req.body;
    const user: User = { name, email, password, age };
    const userDocument = new UserCollection(user);
    userDocument
      .save()
      .then(() => {
        console.log('User created: ' + userDocument);
        res.status(201).send(userDocument);
      })
      .catch((error) => {
        console.log(error.message);
        res.status(400).send(error.message);
      });
  });
};
