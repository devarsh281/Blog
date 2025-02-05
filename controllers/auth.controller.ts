import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser, UserSchemaZod } from "../models/usermodel";

import { AppError } from "../middlewares/error.handlers";

const authController = {
  register: (req: Request, res: Response, next: NextFunction): void => {
    UserSchemaZod.parse(req.body);
    const { username, password } = req.body;

    User.findOne({ role: "admin" }).then((existingAdmin) => {
      const role = existingAdmin ? "user" : "admin";

      User.findOne({ username }).then((existingUser) => {
        if (existingUser) return next(new AppError("User already exists", 400));

        bcrypt.hash(password, 10).then((hashedPassword) => {
          const newUser: IUser = new User({
            username,
            password: hashedPassword,
            role,
          });

          newUser.save().then(() => {
            res.status(201).json({ message: "User registered successfully" });
          });
        });
      });
    });
  },

  login: (req: Request, res: Response, next: NextFunction): void => {
    const { username, password } = req.body;

    User.findOne({ username }).then((user) => {
      if (!user) return next(new AppError("User Not Found", 404));
      if (user.role !== "admin") return next(new AppError("Access Denied. Admins only.", 403));

      bcrypt.compare(password.trim(), user.password).then((isPasswordCorrect) => {
        if (!isPasswordCorrect) return next(new AppError("Password Doesn’t Match", 400));

        const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET || "your-secret-key",
          { expiresIn: "1h" }
        );

        res.status(200).json({ token });
      });
    });
  },

  loginUser: (req: Request, res: Response, next: NextFunction): void => {
    const { username, password } = req.body;

    User.findOne({ username }).then((existingUser) => {
      if (!existingUser) return next(new AppError("Invalid credentials", 400));

      bcrypt.compare(password, existingUser.password).then((isPasswordCorrect) => {
        if (!isPasswordCorrect) return next(new AppError("Invalid credentials", 400));

        const token = jwt.sign(
          { UserId: existingUser._id, role: existingUser.role },
          process.env.JWT_SECRET || "your-secret-key",
          { expiresIn: "1h" }
        );

        res.status(200).json({
          message: "Login successful",
          token,
          user: { username: existingUser.username, role: existingUser.role },
        });
      });
    });
  },

  getAllUsers: async (req: Request, res: Response): Promise<void> => {
    const users = await User.find();
    res.status(200).json({ users });
  },

  getUser: async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User found successfully", user });
  },

  deleteUser: async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;
    const user = await User.findOneAndDelete({ username });
    if (!user) res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  },
};

export default authController;