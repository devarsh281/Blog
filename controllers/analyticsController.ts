import { Request, Response } from "express";
import Post from "../models/PostModel";

const analyticsController = {
  getAnalysis: async (req: Request, res: Response): Promise<void> => {
    try {
      const total: number = await Post.countDocuments();
      const views = await Post.find({}, { title: 1, views: 1 });

      res.status(200).json({ total,views });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};


export default analyticsController;
