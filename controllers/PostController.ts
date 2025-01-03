import { Request, Response } from "express";
import Post, { IPost } from "../models/PostModel";
import Counter, { ICounter } from "../models/Counter";

const PostController = {
  createPost: async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, category } = req.body;

      const postCount = await Post.countDocuments();

      let counter;
      if (postCount === 0) {
        counter = await Counter.findOneAndUpdate(
          { name: "postID" },
          { value: 1 },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );
      } else {
        counter = await Counter.findOneAndUpdate(
          { name: "postID" },
          { $inc: { value: 1 } },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );
      }

      if (!counter) {
        res.status(500).json({ message: "Failed to generate post ID" });
        return;
      }

      const newPost: IPost = new Post({
        id: counter.value,
        title,
        description,
        category,
      });

      await newPost.save();
      res
        .status(201)
        .json({ message: "Post created successfully!", data: newPost });
    } catch (err: any) {
      console.error("Error creating post:", err);
      res.status(500).json({ message: err.message || "Internal Server Error" });
    }
  },

  getAllPosts: async (req: Request, res: Response): Promise<void> => {
    try {
      const posts: IPost[] = await Post.find();
      res.status(200).json({ data: posts });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  getPostByID: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const post: IPost | null = await Post.findOne({ id: Number(id) });

      if (!post) {
        res.status(404).json({ message: "Post not found!" });
        return;
      }

      res.status(200).json(post);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  updatePost: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedPostData = req.body;

      const updatedPost: IPost | null = await Post.findOneAndUpdate(
        { id: Number(id) },
        updatedPostData,
        { new: true }
      );

      if (!updatedPost) {
        res.status(404).json({ message: "Post not found" });
        return;
      }

      res
        .status(200)
        .json({ message: "Post updated successfully", data: updatedPost });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  deletePost: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const deletedPost: IPost | null = await Post.findOneAndDelete({
        id: Number(id),
      });

      if (!deletedPost) {
        res.status(404).json({ message: "Post not found" });
        return;
      }

      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
};

export default PostController;
