import mongooseConnect from './db/mongoose';
import taskRoutes from './routes/api/tasks';
import express from 'express';
import chalk from 'chalk';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

mongooseConnect();

taskRoutes(app);

app.listen(PORT, () => {
  console.log('Server running on PORT ' + chalk.yellow(PORT));
});
