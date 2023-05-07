import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/Users";
import { userBody } from "types/userBody";

const router = express.Router();

router.get("/", async (req, res) => {
  const getAllUsers = await UserModel.find();
  return res.status(200).json(getAllUsers);
});

router.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body as userBody;
  const user = await UserModel.findOne({ username });

  if (user) {
    return res.json({ message: "User already exists!" });
  }

  const hashedPassword = await bcrypt.hash(password, 5);
  const newUser = new UserModel({ username, password: hashedPassword });
  await newUser.save();

  res.json({ message: "User registered successfully!" });
});

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });

  if (!user) {
    return res.json({ message: "User doesn't exist!" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.json({ message: "Username or password is incorrect!" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, userID: user._id });
});

export { router as userRouter };
