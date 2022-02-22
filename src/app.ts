import taskRouter from './routes/api/tasks';
import userRouter from './routes/api/users';
import { IUserDoc } from './models/User';

import express from 'express';
import chalk from 'chalk';

declare global {
  namespace Express {
    interface Request {
      user: IUserDoc;
      token: string;
    }
  }
}

const app = express();
const router = express.Router();

app.use(express.json());

router.use(userRouter);
router.use(taskRouter);
app.use(router);

export default app;
