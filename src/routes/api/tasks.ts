import TaskCollection from '../../models/Task';
import { Express } from 'express';

export default (app: Express) => {
  app.post('/api/v1/tasks', (req, res) => {
    const newTask = new TaskCollection({
      description: req.body.description,
      completed: req.body.completed
    });

    newTask
      .save()
      .then(() => {
        console.log('Task created:');
        console.log(newTask);
        res.send(newTask);
      })
      .catch((error) => {
        console.log(error.message);
      });
  });
};
