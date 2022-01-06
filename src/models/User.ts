import {
  Document,
  model,
  Model,
  Schema,
  Error,
  SchemaDefinitionProperty
} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

export interface IUser {
  name: string;
  email: string;
  password: string;
  age: number;
}

export interface IUserDoc extends IUser, Document {}

enum PropertyNames {
  NAME = 'name',
  EMAIL = 'email',
  PASSWORD = 'password',
  AGE = 'age'
}

export interface IUserModel extends Model<IUserDoc> {
  findByCredentials(email: string, password: string): Promise<IUserDoc>;
}

const UserSchemaFields: Record<keyof IUser, SchemaDefinitionProperty> = {
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
};

const UserSchema = new Schema(UserSchemaFields);

UserSchema.static(
  'findByCredentials',
  async function findByCredentials(
    email: string,
    password: string
  ): Promise<IUserDoc> {
    const user: IUserDoc = await this.findOne({ email });

    if (!user) {
      throw new Error('Unable to login');
    }

    const isMatchingPassword = await bcrypt.compare(password, user.password);

    if (!isMatchingPassword) {
      throw new Error('Unable to login');
    }

    return user;
  }
);

UserSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const UserCollection = model<IUserDoc, IUserModel>(
  'users',
  UserSchema,
  'users'
);

export default UserCollection;
