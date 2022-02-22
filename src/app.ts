import './db/mongoose';
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
const PORT = process.env.PORT || 3000;

app.use(express.json());

router.use(userRouter);
router.use(taskRouter);
app.use(router);

app.listen(PORT, () => {
  console.log('Server running on PORT ' + chalk.yellow(PORT));
});
