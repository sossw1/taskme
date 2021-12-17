import mongoose from 'mongoose';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;
const mongoURL = 'mongodb://127.0.0.1:27017/taskme-api';

mongoose
  .connect(mongoURL)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log(error.message));

app.listen(PORT, () => {
  console.log('App running on port ' + PORT);
});
