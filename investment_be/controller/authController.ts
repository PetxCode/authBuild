import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import authModel from "../model/authModel";
import jwt from "jsonwebtoken";
import env from "dotenv";
import cloudinary from "../utils/cloudinary";
import { sendCreateAccountEmail } from "../utils/email";
env.config();

// AUTH
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const acc = crypto.randomBytes(4).toString("hex");
    const verifyToken = crypto.randomBytes(2).toString("hex");

    const user = await authModel.create({
      email,
      password: hashed,
      accNumber: acc,
      verifyToken,
    });

    sendCreateAccountEmail(user).then(() => {
      console.log("running");
    });

    return res.status(201).json({
      message: "User created successfully",
      data: user,
      status: 201,
    });
  } catch (error) {
    return res.status(404).json({ error: error, status: 404 });
  }
};

export const logInUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const getUser = await authModel.findOne({ email });

    if (getUser) {
      const passwordCheck = await bcrypt.compare(password, getUser.password);

      if (passwordCheck) {
        if (getUser?.isVerify && getUser?.verifyToken === "") {
          const token: any = jwt.sign(
            { id: getUser._id },
            process.env.JWT_SECRET as string,
            { expiresIn: process.env.JWT_TIME }
          );

          return res.status(201).json({
            message: "Welcome back",
            data: token,
            status: 201,
          });
        } else {
          return res.status(404).json({
            message: "Your account hasn't been verified",
            status: 404,
          });
        }
      } else {
        return res.status(404).json({
          message: "Error with user password",
          status: 404,
        });
      }
    } else {
      return res.status(404).json({
        message: "Error with user email",
        status: 404,
      });
    }
  } catch (error) {
    return res.status(404).json({ error: error });
  }
};

export const forgetUserPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await authModel.findOne({
      email,
    });

    if (user) {
      return res.status(201).json({
        message: "A mail has been sent to you for account password reset",
        status: 201,
      });
    } else {
      return res.status(404).json({
        message: "No user with such Email on our DB",
        status: 404,
      });
    }
  } catch (error) {
    return res.status(404).json({ error: error, status: 404 });
  }
};

export const changeUserPassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    const { userID } = req.params;

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = await authModel.findByIdAndUpdate(
      userID,
      {
        password: hashed,
      },
      { new: true }
    );

    return res.status(201).json({
      message: "password updated successfully",
      data: user,
      status: 201,
    });
  } catch (error) {
    return res.status(404).json({ error: error, status: 404 });
  }
};

export const verifyUserAccount = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;

    const user = await authModel.findByIdAndUpdate(
      userID,
      {
        isVerify: true,
        verifyToken: "",
      },
      { new: true }
    );

    return res.status(201).json({
      message: "account verify updated successfully",
      data: user,
      status: 201,
    });
  } catch (error) {
    return res.status(404).json({ error: error, status: 404 });
  }
};

// PROFILE

export const readOneUser = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;

    const user = await authModel.findById(userID);

    return res.status(200).json({
      message: "User found successfully",
      data: user,
      status: 200,
    });
  } catch (error) {
    return res.status(404).json({ error: error, status: 404 });
  }
};

export const updateOneUserName = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { firstName, lastName, userName } = req.body;

    const user = await authModel.findByIdAndUpdate(
      userID,
      {
        firstName,
        lastName,
        userName,
      },
      { new: true }
    );

    return res.status(201).json({
      message: "update user names successfully",
      data: user,
      status: 201,
    });
  } catch (error) {
    return res.status(404).json({ error: error, status: 404 });
  }
};

export const updateOneUserAvatar = async (req: any, res: Response) => {
  try {
    const { userID } = req.params;
    const userData: any = await authModel.findById(userID);

    if (userData?.avatarID) {
      await cloudinary.uploader.destroy(userData?.avatarID);
    }

    const { secure_url, public_id }: any = await cloudinary.uploader.upload(
      req.file.path
    );

    const user = await authModel.findByIdAndUpdate(
      userID,
      {
        avatar: secure_url,
        avatarID: public_id,
      },
      { new: true }
    );

    return res.status(201).json({
      message: "update user avatar successfully",
      data: user,
      status: 201,
    });
  } catch (error) {
    return res.status(404).json({ error: error, status: 404 });
  }
};
