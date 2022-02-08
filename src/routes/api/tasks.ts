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
  const match: any = {};

  if (req.query.completed) {
    match.completed = req.query.completed === 'true';
  }

  try {
    const user: any = req.user;

    let limit;
    const queryLimit = req.query.limit;
    if (queryLimit) {
      if (typeof queryLimit === 'string') {
        limit = parseInt(queryLimit);
      }
    }

    let skip;
    const querySkip = req.query.skip;
    if (querySkip) {
      if (typeof querySkip === 'string') {
        skip = parseInt(querySkip);
      }
    }

    let sort: any = {};
    const querySort = req.query.sort;
    if (querySort) {
      if (typeof querySort === 'string') {
        const sortParams = querySort.split(':');
        sort[sortParams[0]] = sortParams[1] === 'desc' ? -1 : 1;
      }
    }

    await user.populate({
      path: 'tasks',
      match,
      options: {
        limit,
        skip,
        sort
      }
    });
    res.send(user.tasks);
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

router.patch('/api/v1/tasks/:id', auth, async (req: Request, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['description', 'completed'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates' });
  } else {
    try {
      const task: any = await TaskCollection.findOne({
        _id: req.params.id,
        owner: req.user._id
      });

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

router.delete(
  '/api/v1/tasks/:id',
  auth,
  async (req: Request, res: Response) => {
    try {
      const task = await TaskCollection.findOneAndDelete({
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
  }
);

export default router;
