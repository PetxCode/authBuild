import { Document, model, Schema, Types } from "mongoose";

interface iAuth {
  // profile
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar: string;
  avatarID: string;
  accNumber: string;

  isVerify: boolean;
  verifyToken: string;

  // investments
  wallet: number;
  transactionHistory: any[];
}

interface iAuthData extends iAuth, Document {}

const authModel = new Schema<iAuthData>(
  {
    isVerify: {
      type: Boolean,
      default: false,
    },
    accNumber: {
      type: String,
      unique: true,
    },

    verifyToken: {
      type: String,
    },

    userName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    avatar: {
      type: String,
    },
    avatarID: {
      type: String,
    },
    wallet: {
      type: Number,
      default: 200,
    },
    transactionHistory: [
      {
        type: Types.ObjectId,
        ref: "transactions",
      },
    ],
  },
  { timestamps: true }
);

export default model<iAuthData>("users", authModel);
