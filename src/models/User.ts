import mongoose, { Schema, Model, Document } from 'mongoose';

export const userSchema = new Schema({});

const UserDocument: Model<Document> = mongoose.model('User', userSchema);
export default UserDocument;
