import mongoose from 'mongoose';
import express from 'express';
import chalk from 'chalk';

const app = express();
const PORT = process.env.PORT || 3000;
const mongoURL = 'mongodb://127.0.0.1:27017/taskme-api';

mongoose
  .connect(mongoURL)
  .then(() => {
    console.log('MongoDB ' + chalk.green('connected'));
  })
  .catch((error) => {
    chalk.red(error.message);
  });

app.listen(PORT, () => {
  console.log('Server running on PORT ' + chalk.yellow(PORT));
});
