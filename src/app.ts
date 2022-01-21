import mongooseConnect from './db/mongoose';
import taskRouter from './routes/api/tasks';
import userRouter from './routes/api/users';
import express from 'express';
import chalk from 'chalk';
import { IUserDoc } from './models/User';

declare global {
  namespace Express {
    interface Request {
      user: IUserDoc;
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

mongooseConnect();

app.listen(PORT, () => {
  console.log('Server running on PORT ' + chalk.yellow(PORT));
});
