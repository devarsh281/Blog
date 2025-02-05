import { NextFunction, Request, Response } from "express";
import Post from "../models/postmodel";
import { AppError } from "../middlewares/error.handlers";


const analyticsController = {
  getAnalysis: async (req: Request, res: Response, next: NextFunction) => {
    const total: number = await Post.countDocuments();
    if (total === undefined) {
      return next(new AppError("Failed to fetch total post count", 500));
    }
    res.status(200).json({ total });
  },

  viewCount: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const postId = Number(id);

    if (isNaN(postId)) {
      return next(new AppError("Invalid post ID", 400)); 
    }

    const post = await Post.findOneAndUpdate(
      { id: postId },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!post) {
      return next(new AppError("Post not found", 404)); 
    }

    res.status(200).json({
      message: "Post views incremented successfully",
      postId: id,
      views: post.views,
    });
  },
};

export default analyticsController;
