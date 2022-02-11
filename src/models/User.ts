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
import jwt, { Jwt } from 'jsonwebtoken';
import TaskCollection from './Task';

export interface IToken extends Document {
  token: string;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  age: number;
  tokens: IToken[];
  avatar: Buffer | undefined;
}

export interface IUserDoc extends IUser, Document {
  generateAuthToken(): Jwt;
}

enum PropertyNames {
  NAME = 'name',
  EMAIL = 'email',
  PASSWORD = 'password',
  AGE = 'age',
  TOKENS = 'tokens',
  AVATAR = 'avatar'
}

export interface IUserModel extends Model<IUserDoc> {
  findByCredentials(email: string, password: string): Promise<IUserDoc>;
  PropertyNames: typeof PropertyNames;
}

const UserSchemaFields: Record<keyof IUser, SchemaDefinitionProperty> = {
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
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
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ],
  avatar: {
    type: Buffer
  }
};

const UserSchema = new Schema(UserSchemaFields, {
  timestamps: true
});

UserSchema.virtual('tasks', {
  ref: 'tasks',
  localField: '_id',
  foreignField: 'owner'
});

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const secret: string = process.env.JWT_SECRET || 'd^e#f@a*u$l%t';
  const token = jwt.sign({ _id: user._id.toString() }, secret);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

UserSchema.methods.toJSON = function () {
  const user: IUserDoc = this;
  const userObject: any = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

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

UserSchema.pre('remove', async function (next) {
  const user = this;
  await TaskCollection.deleteMany({ owner: user._id });
  next();
});

const UserCollection = model<IUserDoc, IUserModel>(
  'users',
  UserSchema,
  'users'
);

export default UserCollection;
