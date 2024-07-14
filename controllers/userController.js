import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import validator from "validator";

const { isEmail } = validator;
const createToken = ({ id }) => {
  return jwt.sign({ id }, "tokenSecrete");
};

async function signup(req, res) {
  try {
    const { userName, email, password } = req.body;
    console.log(req.body);
    const userExists = await User.findOne({ $or: [{ email }, { userName }] });

    if (!isEmail(email)) {
      res.status(400).json({ message: "Invalid Email" });
      return;
    }

    if (userExists) {
      res
        .status(400)
        .json({ message: "User already exists with same userName or Email" });
      return;
    }

    if (password.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      userName,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = createToken(user._id);
    return res.status(200).json({
      success: true,
      message: "Succesfully created User!",
      token: token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
}

async function signin(req, res) {
  try {
    const { userName, email, password } = req.body;
    console.log(req.body);

    // Find user by email or username
    const user = await User.findOne({ $or: [{ email }, { userName }] });
    // const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Email or Username" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = createToken(user._id);
    return res.status(200).json({
      success: true,
      message: "Successfully found User!",
      token: token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
}

async function getUsers(req, res) {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
}

export { signup, signin, getUsers };
