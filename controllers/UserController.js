import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import userModel from "../models/User.js";

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new userModel({
      fullName: req.body.fullName,
      email: req.body.email,
      passwordHash: hash,
      avatarUrl: req.body.avatarUrl,
    });

    const user = await doc.save();
    const token = jwt.sign({ _id: user._id }, "secret", {
      expiresIn: "3d",
    });

    const { passwordHash, ...userData } = user._doc;
    res.send({ ...userData, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error registering user",
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    const token = jwt.sign({ _id: user._id }, "secret", {
      expiresIn: "3d",
    });
    const { passwordHash, ...userData } = user._doc;
    res.send({ ...userData, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error logging in user",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const { passwordHash, ...userData } = user._doc;
    res.send(userData);

    res.json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error getting user",
    });
  }
};
