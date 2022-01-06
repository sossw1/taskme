import UserCollection from '../../models/User';
import express, { Request, Response } from 'express';

interface User {
  name: string;
  email: string;
  password: string;
  age: number;
}

const router = express.Router();

router.get('/api/v1/users', async (req: Request, res: Response) => {
  try {
    const users = await UserCollection.find({});
    res.send(users);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.get('/api/v1/users/:id', async (req: Request, res: Response) => {
  try {
    const user = await UserCollection.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .send({ error: 'Unable to find user with provided ID' });
    }
    res.send(user);
  } catch (error: any) {
    if (error.name === 'CastError') {
      return res.status(400).send({ error: 'Invalid user ID' });
    }
    res.sendStatus(500);
  }
});

router.post('/api/v1/users', async (req: Request, res: Response) => {
  const { name, email, password, age } = req.body;
  const user: User = { name, email, password, age };
  const userDocument = new UserCollection(user);
  try {
    await userDocument.save();
    res.status(201).send(userDocument);
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      let errorMessage = 'Invalid user data provided - ';
      const { errors } = error;

      if (errors.name) {
        errorMessage += errors.name.message;
      } else if (errors.email) {
        errorMessage += errors.email.message;
      } else if (errors.password) {
        errorMessage += errors.password.message;
      } else if (errors.age) {
        errorMessage += errors.age.message;
      } else {
        errorMessage = errorMessage.slice(0, -3);
      }

      return res.status(400).send({ error: errorMessage });
    }

    if (error.code === 11000) {
      return res.status(400).send({ error: 'Email must be unique' });
    }

    res.sendStatus(500);
  }
});

router.post('/api/v1/users/login', async (req: Request, res: Response) => {
  try {
    const user: User = await UserCollection.findByCredentials(
      req.body.email,
      req.body.password
    );

    res.send(user);
  } catch (error) {
    res.sendStatus(400);
  }
});

router.patch('/api/v1/users/:id', async (req: Request, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' });
  } else {
    try {
      const user: any = await UserCollection.findById(req.params.id);

      if (user) {
        updates.forEach((update) => (user[update] = req.body[update]));

        await user.save();

        res.send(user);
      } else {
        return res
          .status(404)
          .send({ error: 'Unable to find user with provided ID' });
      }
    } catch (error: any) {
      if (error.name === 'CastError') {
        return res.status(400).send({ error: 'Invalid user ID' });
      }
      if (error.name === 'ValidationError') {
        let errorMessage = 'Invalid user data provided - ';
        const { errors } = error;

        if (errors.name) {
          errorMessage += errors.name.message;
        } else if (errors.email) {
          errorMessage += errors.email.message;
        } else if (errors.password) {
          errorMessage += errors.password.message;
        } else if (errors.age) {
          errorMessage += errors.age.message;
        } else {
          errorMessage = errorMessage.slice(0, -3);
        }

        return res.status(400).send({ error: errorMessage });
      }

      res.sendStatus(500);
    }
  }
});

router.delete('/api/v1/users/:id', async (req: Request, res: Response) => {
  try {
    const user = await UserCollection.findByIdAndDelete(req.params.id);
    if (!user) {
      return res
        .status(404)
        .send({ error: 'Unable to find user with provided ID' });
    }
    res.send(user);
  } catch (error: any) {
    if (error.name === 'CastError') {
      return res.status(400).send({ error: 'Invalid user ID' });
    }

    res.sendStatus(500);
  }
});

export default router;
