import mongoose, {
  model,
  Schema,
  Model,
  Document,
  SchemaDefinitionProperty
} from 'mongoose';

export interface ITask {
  description: string;
  completed: boolean;
  owner: string;
}

export interface ITaskDoc extends ITask, Document {}

enum PropertyNames {
  DESCRIPTION = 'description',
  COMPLETED = 'completed',
  OWNER = 'owner'
}

export interface ITaskModel extends Model<ITaskDoc> {
  PropertyNames: typeof PropertyNames;
}

export const TaskSchemaFields: Record<keyof ITask, SchemaDefinitionProperty> = {
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    required: false,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'UserCollection'
  }
};

const TaskSchema = new Schema(TaskSchemaFields);

const TaskCollection = model<ITaskDoc, ITaskModel>(
  'tasks',
  TaskSchema,
  'tasks'
);

export default TaskCollection;
