import mongoose, { Schema, Model, Document } from 'mongoose';
import validator from 'validator';

export const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    validate(value: string) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    }
  }
});

const UserDocument: Model<Document> = mongoose.model('User', userSchema);
export default UserDocument;
