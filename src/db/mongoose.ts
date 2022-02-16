import mongoose from 'mongoose';
import chalk from 'chalk';

export default () => {
  const mongoURL =
    (process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/taskme-api') +
    '?retryWrites=true&w=majority';

  mongoose
    .connect(mongoURL)
    .then(() => {
      console.log('MongoDB ' + chalk.green('connected'));
    })
    .catch((error) => {
      chalk.red(error.message);
    });
};
