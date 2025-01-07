import { Request, Response } from "express";
import Post, { IPost } from "../models/PostModel";

const analyticsController = {
  getAnalysis: async (req: Request, res: Response): Promise<void> => {
    try {
      const total: number = await Post.countDocuments();

      res.status(200).json({ total });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
  viewCount: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params; 
      const postId = Number(id);
  
      if (isNaN(postId)) {
        res.status(400).json({ message: "Invalid post ID" });
        return;
      }
  
      const post = await Post.findOneAndUpdate(
        { id: postId },
        { $inc: { views: 1 } },
        { new: true }
      );
  
      if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
      }
  
      res.status(200).json({
        message: "Post views incremented successfully",
        postId: id,
        views: post.views,
      });
    } catch (error: any) {
      res.status(500).json({
        message: "An error occurred while incrementing the view count.",
        error: error.message,
      });
    }
  }
  
  
};

export default analyticsController;
