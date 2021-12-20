import mongooseConnect from './db/mongoose';
import express from 'express';
import chalk from 'chalk';

const app = express();
const PORT = process.env.PORT || 3000;

mongooseConnect();

app.listen(PORT, () => {
  console.log('Server running on PORT ' + chalk.yellow(PORT));
});
