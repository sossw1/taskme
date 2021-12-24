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
      res.sendStatus(500);
    }
  });

  app.get('/api/v1/users/:id', async (req: Request, res: Response) => {
    try {
      const user = await UserCollection.findById(req.params.id);
      if (!user) {
        return res
          .status(404)
          .send({ error: 'Not Found - Unable to find user with provided ID' });
      }
      res.send(user);
    } catch (error: any) {
      if (error.name === 'CastError') {
        return res.status(400).send({ error: 'Bad Request - Invalid user ID' });
      }
      res.sendStatus(500);
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

      if (!user) {
        return res
          .status(404)
          .send({ error: 'Not Found - Unable to find user with provided ID' });
      }

      res.send(user);
    } catch (error: any) {
      if (error.name === 'CastError') {
        return res.status(404).send({ error: 'Invalid user ID' });
      }
      res.sendStatus(400);
    }
  });

  app.delete('/api/v1/users/:id', async (req: Request, res: Response) => {
    try {
      const user = await UserCollection.findByIdAndDelete(req.params.id);
      if (!user) {
        return res
          .status(404)
          .send({ error: 'Not Found - Unable to find user with provided ID' });
      }
      res.send(user);
    } catch (error: any) {
      if (error.name === 'CastError') {
        return res.status(400).send({ error: 'Bad Request - Invalid user ID' });
      }

      res.sendStatus(500);
    }
  });
};
