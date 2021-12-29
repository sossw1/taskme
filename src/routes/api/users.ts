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

    res.sendStatus(500);
  }
});

router.patch('/api/v1/users/:id', async (req: Request, res: Response) => {
  try {
    // Using findOneAndUpdate instead of findByIdAndUpdate method due to
    // pre & post hooks not being executed for findByIdAndUpdate
    const user = await UserCollection.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

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
