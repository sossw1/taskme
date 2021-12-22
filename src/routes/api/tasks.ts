import TaskCollection from '../../models/Task';
import { Express, Request, Response } from 'express';

interface Task {
  description: string;
  completed: boolean;
}

export default (app: Express) => {
  app.get('/api/v1/tasks', (req: Request, res: Response) => {
    TaskCollection.find({})
      .then((tasks) => {
        res.send(tasks);
      })
      .catch((error) => {
        res.status(500).send();
      });
  });

  app.get('/api/v1/tasks/:id', (req: Request, res: Response) => {
    TaskCollection.findById(req.params.id)
      .then((task) => {
        res.send(task);
      })
      .catch((error) => {
        if (error.name === 'CastError') {
          return res.status(404).send();
        }
        res.status(500).send();
      });
  });

  app.post('/api/v1/tasks', (req: Request, res: Response) => {
    const { description, completed } = req.body;
    const task: Task = { description, completed };
    const taskDocument = new TaskCollection(task);
    taskDocument
      .save()
      .then(() => {
        console.log('Task created: ' + taskDocument);
        res.status(201).send(taskDocument);
      })
      .catch((error) => {
        console.log(error.message);
        res.status(400).send(error.message);
      });
  });
};
