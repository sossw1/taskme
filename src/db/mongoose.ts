import mongoose from 'mongoose';
import chalk from 'chalk';

const mongoURL = 'mongodb://127.0.0.1:27017/taskme-api';

export default () => {
  mongoose
    .connect(mongoURL)
    .then(() => {
      console.log('MongoDB ' + chalk.green('connected'));
    })
    .catch((error) => {
      chalk.red(error.message);
    });
};
