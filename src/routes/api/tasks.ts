import TaskCollection from '../../models/Task';
import { Express, Request, Response } from 'express';

interface Task {
  description: string;
  completed: boolean;
}

export default (app: Express) => {
  app.get('/api/v1/tasks', async (req: Request, res: Response) => {
    try {
      const task = await TaskCollection.find({});
      res.send(task);
    } catch (error) {
      res.status(500).send();
    }
  });

  app.get('/api/v1/tasks/:id', async (req: Request, res: Response) => {
    try {
      const task = await TaskCollection.findById(req.params.id);
      res.send(task);
    } catch (error: any) {
      if (error.name === 'CastError') {
        return res.status(404).send();
      }
      res.status(500).send();
    }
  });

  app.post('/api/v1/tasks', async (req: Request, res: Response) => {
    const { description, completed } = req.body;
    const task: Task = { description, completed };
    const taskDocument = new TaskCollection(task);
    try {
      await taskDocument.save();
      res.status(201).send(taskDocument);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  app.patch('/api/v1/tasks/:id', async (req: Request, res: Response) => {
    try {
      const task = await TaskCollection.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

      res.send(task);
    } catch (error: any) {
      if (error.name === 'CastError') {
        return res.status(404).send();
      }

      res.status(400).send(error);
    }
  });
};
