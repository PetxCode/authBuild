import { Request, Response } from "express";
import crypto from "crypto";
import transactionModel from "../model/transactionModel";
import authModel from "../model/authModel";
import { Types } from "mongoose";
import env from "dotenv";
env.config();
import axios from "axios";

export const fundWallet = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { amount, email } = req.body;

    console.log(amount);

    const getUser: any = await authModel.findById(userID);

    const params = {
      email: email,
      amount: `${amount * 100}`,
      callback_url: "http://localhost:5174/success/",
      channels: ["card"],
      metadata: {
        cancel_action: "http://localhost:5174/cart/",
      },
    };

    const data = await axios
      .post(`https://api.paystack.co/transaction/initialize`, params, {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        return res.data;
      });

    return res.status(201).json({
      message: "User account credited successfully",
      data,
      status: 201,
    });
  } catch (error) {
    return res.status(404).json({ error: error, status: 404 });
  }
};

export const verifyFundTransaction = async (req: Request, res: Response) => {
  try {
    const { reference } = req.params;

    const data = await axios
      .get(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        return res.data?.data;
      });

    if (data?.status === "success") {
      return res.status(201).json({
        message: "payment verified successfully",
        data,
        status: 200,
      });
    } else {
      return res.status(404).json({
        message: "something went wrong",
      });
    }
  } catch (error) {
    return res.status(404).json({ error: error, status: 404 });
  }
};

export const fundTransfer = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { accNumber, amount, description } = req.body;

    const getUser: any = await authModel.findById(userID);

    const getWhomUser: any = await authModel.findOne({ accNumber });

    if (getUser) {
      const ID = crypto.randomBytes(3).toString("hex");
      if (getUser?.wallet > amount) {
        await authModel.findByIdAndUpdate(
          userID,
          {
            wallet: getUser?.wallet - parseInt(amount),
          },
          { new: true }
        );

        await authModel.findByIdAndUpdate(
          getWhomUser?._id,
          {
            wallet: getWhomUser?.wallet + parseInt(amount),
          },
          { new: true }
        );

        const debit: any = await transactionModel.create({
          transactionID: ID,
          amount,
          status: "debit",
          sentBy: `${
            getUser?.lastName
              ? `${getUser?.lastName} ${getUser?.firstName}`
              : `${getUser?.email}`
          }`,
          sentTo: `${
            getWhomUser?.lastName
              ? `${getWhomUser?.lastName} ${getWhomUser?.firstName}`
              : `${getWhomUser?.email}`
          }`,
          description,
          balance: getUser?.wallet - parseInt(amount),
          user: getUser?._id,
        });

        const credit: any = await transactionModel.create({
          transactionID: ID,
          amount,
          status: "credit",
          sentTo: `${
            getUser?.lastName
              ? `${getUser?.lastName} ${getUser?.firstName}`
              : `${getUser?.email}`
          }`,
          sentBy: `${
            getWhomUser?.lastName
              ? `${getWhomUser?.lastName} ${getWhomUser?.firstName}`
              : `${getWhomUser?.email}`
          }`,
          description,
          balance: getUser?.wallet + parseInt(amount),
          user: getUser?._id,
        });

        getUser?.transactionHistory.push(new Types.ObjectId(debit._id));
        getUser?.save();

        getWhomUser?.transactionHistory.push(new Types.ObjectId(credit._id));
        getWhomUser?.save();

        return res.status(201).json({
          message: "amount credit to account successfully",
          data: debit,
          status: 201,
        });
      } else {
        return res
          .status(404)
          .json({ error: "insufficient Funds", status: 404 });
      }
    } else {
      return res.status(404).json({ error: "user not found", status: 404 });
    }
  } catch (error) {
    return res.status(404).json({ error: error, status: 404 });
  }
};

export const viewTransactionHistory = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;

    const history = await authModel.findById(userID).populate({
      path: "transactionHistory",
      options: {
        sort: {
          createdAt: -1,
        },
      },
    });

    let x = ["Apple", "Banana", "Grape", "Orange", "Pine-Apple", "Watermelon"];
    let y = "l";

    console.log(
      x.filter((el: any) => {
        return el.toLowerCase().includes(y.toLowerCase());
      })
    );

    return res.status(200).json({
      message: "history found successfully",
      data: history,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({ error: error, status: 404 });
  }
};
