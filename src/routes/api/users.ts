import UserCollection from '../../models/User';
import { Express, Request, Response } from 'express';

interface User {
  name: string;
  email: string;
  password: string;
  age: number;
}

export default (app: Express) => {
  app.get('/api/v1/users', async (req: Request, res: Response) => {
    try {
      const users = await UserCollection.find({});
      res.send(users);
    } catch (error) {
      res.status(500).send();
    }
  });

  app.get('/api/v1/users/:id', (req: Request, res: Response) => {
    UserCollection.findById(req.params.id)
      .then((user) => {
        res.send(user);
      })
      .catch((error) => {
        if (error.name === 'CastError') {
          return res.status(404).send();
        }
        res.status(500).send();
      });
  });

  app.post('/api/v1/users', async (req: Request, res: Response) => {
    const { name, email, password, age } = req.body;
    const user: User = { name, email, password, age };
    const userDocument = new UserCollection(user);
    try {
      await userDocument.save();
      res.status(201).send(user);
    } catch (error) {
      res.status(400).send(error);
    }
  });
};
