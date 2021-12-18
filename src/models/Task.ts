import mongoose, { Schema, Model, Document } from 'mongoose';

export const taskSchema = new Schema({});

const TaskCollection: Model<Document> = mongoose.model('Task', taskSchema);
export default TaskCollection;
