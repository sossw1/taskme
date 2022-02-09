import UserCollection, { IUser, IToken } from '../../models/User';
import express, { Request, Response } from 'express';
import auth from '../../middleware/auth';
import multer from 'multer';

const router = express.Router();

router.get('/api/v1/users/me', auth, async (req: Request, res: Response) => {
  res.send(req.user);
});

router.post('/api/v1/users', async (req: Request, res: Response) => {
  const {
    name,
    email,
    password,
    age,
    tokens
  }: {
    name: string;
    email: string;
    password: string;
    age: number;
    tokens: IToken[];
  } = req.body;
  const user: IUser = { name, email, password, age, tokens };
  const userDocument = new UserCollection(user);
  try {
    await userDocument.save();
    const token = await userDocument.generateAuthToken();
    res.status(201).send({ user: userDocument, token });
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
      } else if (errors.tokens) {
        errorMessage += errors.tokens.message;
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
    const { email, password }: { email: string; password: string } = req.body;
    const user = await UserCollection.findByCredentials(email, password);

    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.sendStatus(400);
  }
});

router.post(
  '/api/v1/users/logout',
  auth,
  async (req: Request, res: Response) => {
    try {
      req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.token;
      });
      await req.user.save();

      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  }
);

router.post(
  '/api/v1/users/logout/all',
  auth,
  async (req: Request, res: Response) => {
    try {
      req.user.tokens = [];
      await req.user.save();
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(500);
    }
  }
);

const upload = multer({
  dest: 'avatars',
  limits: {
    fileSize: 1000000
  }
});

router.post(
  '/api/v1/users/me/avatar',
  upload.single('avatar'),
  (req: Request, res: Response) => {
    res.send();
  }
);

router.patch('/api/v1/users/me', auth, async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const { name, email, password, age } = req.body;

    if (name || name === '') {
      user.name = name;
    }

    if (email || email === '') {
      user.email = email;
    }
    if (password || password === '') {
      user.password = password;
    }
    if (age) {
      user.age = age;
    }

    await user.save();

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
      } else if (errors.tokens) {
        errorMessage += errors.tokens.message;
      } else {
        errorMessage = errorMessage.slice(0, -3);
      }

      return res.status(400).send({ error: errorMessage });
    }
    res.sendStatus(500);
  }
});

router.delete('/api/v1/users/me', auth, async (req: Request, res: Response) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (error: any) {
    if (error.name === 'CastError') {
      return res.status(400).send({ error: 'Invalid user ID' });
    }

    res.sendStatus(500);
  }
});

export default router;
