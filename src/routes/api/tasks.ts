import TaskCollection from '../../models/Task';
import express, { Request, Response } from 'express';
import auth from '../../middleware/auth';

interface Task {
  description: string;
  completed: boolean;
  owner: string;
}

const router = express.Router();

router.get('/api/v1/tasks', auth, async (req: Request, res: Response) => {
  try {
    const tasks = await TaskCollection.find({ owner: req.user._id });
    res.send(tasks);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.get('/api/v1/tasks/:id', auth, async (req: Request, res: Response) => {
  try {
    const task = await TaskCollection.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!task) {
      return res
        .status(404)
        .send({ error: 'Unable to find task with provided ID' });
    }
    res.send(task);
  } catch (error: any) {
    if (error.name === 'CastError') {
      return res.status(400).send({ error: 'Invalid task ID' });
    }
    res.sendStatus(500);
  }
});

router.post('/api/v1/tasks', auth, async (req: Request, res: Response) => {
  const { description, completed } = req.body;
  const owner = req.user._id;
  const task: Task = { description, completed, owner };
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

router.patch('/api/v1/tasks/:id', async (req: Request, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' });
  } else {
    try {
      const task: any = await TaskCollection.findById(req.params.id);

      if (task) {
        updates.forEach((update) => (task[update] = req.body[update]));

        await task.save();

        res.send(task);
      } else {
        return res
          .status(404)
          .send({ error: 'Unable to find task with provided ID' });
      }
    } catch (error: any) {
      if (error.name === 'CastError') {
        return res.status(400).send({ error: 'Invalid task ID' });
      }
      if (error.name === 'ValidationError') {
        const errorMessage = `Invalid task data provided - ${error.errors.description.message}`;
        return res.status(400).send({ error: errorMessage });
      }
      res.sendStatus(500);
    }
  }
});

router.delete('/api/v1/tasks/:id', async (req: Request, res: Response) => {
  try {
    const task = await TaskCollection.findByIdAndDelete(req.params.id);
    if (!task) {
      return res
        .status(404)
        .send({ error: 'Unable to find user with provided ID' });
    }
    res.send(task);
  } catch (error: any) {
    if (error.name === 'CastError') {
      return res.status(400).send({ error: 'Invalid task ID' });
    }

    res.sendStatus(500);
  }
});

export default router;
