import mongoose, { Schema, Model, Document } from 'mongoose';

export const taskSchema = new Schema({
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
    required: true
  }
});

const TaskCollection: Model<Document> = mongoose.model('Task', taskSchema);
export default TaskCollection;
