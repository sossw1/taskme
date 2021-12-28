import TaskCollection from '../../models/Task';
import { Express, Request, Response } from 'express';

interface Task {
  description: string;
  completed: boolean;
}

export default (app: Express) => {
  app.get('/api/v1/tasks', async (req: Request, res: Response) => {
    try {
      const tasks = await TaskCollection.find({});
      res.send(tasks);
    } catch (error) {
      res.sendStatus(500);
    }
  });

  app.get('/api/v1/tasks/:id', async (req: Request, res: Response) => {
    try {
      const task = await TaskCollection.findById(req.params.id);
      if (!task) {
        return res
          .status(404)
          .send({ error: 'Not Found - Unable to find task with provided ID' });
      }
      res.send(task);
    } catch (error: any) {
      if (error.name === 'CastError') {
        return res.status(400).send({ error: 'Bad Request - Invalid task ID' });
      }
      res.sendStatus(500);
    }
  });

  app.post('/api/v1/tasks', async (req: Request, res: Response) => {
    const { description, completed } = req.body;
    const task: Task = { description, completed };
    const taskDocument = new TaskCollection(task);
    try {
      await taskDocument.save();
      res.status(201).send(taskDocument);
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        const errorMessage = `Invalid task data provided - ${error.errors.description.message}`;
        return res.status(400).send({ error: errorMessage });
      }

      res.sendStatus(500);
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

      if (!task) {
        return res.sendStatus(404);
      }

      res.send(task);
    } catch (error: any) {
      if (error.name === 'CastError') {
        return res.sendStatus(400);
      }

      res.sendStatus(400);
    }
  });
};
