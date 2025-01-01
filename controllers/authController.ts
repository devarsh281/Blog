import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/UserModel";

const authController = {
  register: async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
      const existingAdmin = await User.findOne({ role: "admin" });
      const role = existingAdmin ? "user" : "admin";

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        res.status(400).json({ error: "User already exists" });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser: IUser = new User({
        username,
        password: hashedPassword,
        role,
      });
      await newUser.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  login: async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });
      if (!user) {
        res.status(404).json({ error: "User Not Found" });
        return;
      }
      if (user.role !== "admin") {
        res.status(403).json({ error: "Access Denied. Admins only." });
        return;
      }
      const trimmedPassword = password.trim();
      const isPassword = await bcrypt.compare(trimmedPassword, user.password);

      if (!isPassword) {
        res.status(400).json({ error: "Password Doesn’t Match" });
        return;
      }
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.key as string,
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({ token });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
};

export default authController;
