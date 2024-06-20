import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your Name'],
    },
    password: {
      type: String,
      required: [true, 'Please provide your Password'],
    },
    mobileNo: {
      type: String,
      unique: [true, 'Mobile No is already used'],
      required: [true, 'Mobile No can not be empty'],
    },
    role: {
      type: String,
      enum: ['admin', 'client'],
      default: 'client',
    },
  },
  {
    timestamps: true,
  }
);

const User = model('User', userSchema);

export default User;
