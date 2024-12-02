import { Types, Document, model, models, Schema } from "mongoose";

interface iTransaction {
  sentBy: string;
  sentTo: string;
  status: string;
  amount: number;
  balance: number;
  transactionID: string;
  description: string;
  user: {};
}

interface iTransactionData extends iTransaction, Document {}

const transactionModel = new Schema<iTransactionData>(
  {
    sentBy: {
      type: String,
    },
    sentTo: {
      type: String,
    },
    status: {
      type: String,
    },
    transactionID: {
      type: String,
    },
    description: {
      type: String,
    },
    amount: {
      type: Number,
    },
    balance: {
      type: Number,
    },
    user: {
      type: Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

export default model<iTransactionData>("transactions", transactionModel);
