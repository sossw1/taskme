import mongoose, { Schema, Model, Document } from 'mongoose';

export const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

const UserDocument: Model<Document> = mongoose.model('User', userSchema);
export default UserDocument;
