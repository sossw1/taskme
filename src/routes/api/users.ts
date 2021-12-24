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

  app.get('/api/v1/users/:id', async (req: Request, res: Response) => {
    try {
      const user = await UserCollection.findById(req.params.id);
      res.send(user);
    } catch (error: any) {
      if (error.name === 'CastError') {
        return res.status(404).send();
      }
      res.status(500).send();
    }
  });

  app.post('/api/v1/users', async (req: Request, res: Response) => {
    const { name, email, password, age } = req.body;
    const user: User = { name, email, password, age };
    const userDocument = new UserCollection(user);
    try {
      await userDocument.save();
      res.status(201).send(userDocument);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  app.patch('/api/v1/users/:id', async (req: Request, res: Response) => {
    try {
      const user = await UserCollection.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );
      res.send(user);
    } catch (error: any) {
      if (error.name === 'CastError') {
        return res.status(404).send(error);
      }
      res.status(400).send(error);
    }
  });

  app.delete('/api/v1/users/:id', async (req: Request, res: Response) => {
    try {
      const user = await UserCollection.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).send();
      }
      res.send(user);
    } catch (error: any) {
      if (error.name === 'CastError') {
        return res.status(404).send();
      }

      res.status(400).send();
    }
  });
};
