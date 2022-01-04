import mongoose, { Schema, Model, Document } from 'mongoose';
import validator from 'validator';

export const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value: string) {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email');
      }
    }
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    default: 0,
    validate(value: number) {
      if (value < 0) {
        throw new Error('Age must be nonnegative');
      }
    }
  }
});

userSchema.pre('save', async function (next) {
  next();
});

const UserCollection: Model<Document> = mongoose.model('User', userSchema);
export default UserCollection;
