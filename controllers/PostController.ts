import { Request, Response } from "express";
import Post, { IPost } from "../models/PostModel";
import Counter, { ICounter } from "../models/Counter";
import multer from "multer";
import path from "path";
import fs from "fs";
const storage = multer.diskStorage({
  destination: path.join(__dirname, "uploads"),
  filename: function (req, file, res) {
    res(null, Date.now() + "-" + file.originalname);
  },
});

let upload = multer({ storage });
let commentCounter = 0;

const PostController = {
  
  // Creating Post
  createPost: async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, category, image } = req.body;

      let imageUrl = "";
      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
      }
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
        image: imageUrl,
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

  // Fetching All Post
  getAllPosts: async (req: Request, res: Response): Promise<void> => {
    try {
      const posts: IPost[] = await Post.find();
      res.status(200).json({ data: posts });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  //  Fetching  Post by ID
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

  
    //  Fetching  Image by ID
  getImageByPostID: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const post = await Post.findOne({ id: Number(id) });
      if (!post || !post.image) {
        res.status(404).json({ message: "Image not found for this post" });
        return;
      }
      const imagePath = path.join(__dirname, "..", post.image);

      if (!fs.existsSync(imagePath)) {
        res.status(404).json({ message: "Image file not found" });
        return;
      }

      res.sendFile(imagePath);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // Updating Post
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

  // Deleting Post
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

  // Like the Post
  likePost: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { username } = req.body;

      console.log("Post ID:", id);
      console.log("User Name:", username);

      const post: IPost | null = await Post.findOne({ id: Number(id) });
      if (!post) {
        console.log("Post not found!");
        res.status(404).json({ message: "Post not found!" });
        return;
      }

      console.log("Current Likes Array:", post.likes);

      if (post.likes.includes(username)) {
        console.log("User has already liked this post.");
        post.likes = post.likes.filter((user) => user !== username);
        post.likesCount -= 1;
      } else {
        console.log("User liking the post.");
        post.likes.push(username);
        post.likesCount += 1;
      }

      console.log("Updated Likes Array:", post.likes);

      await post.save();

      res.status(200).json({ message: "Post liked successfully!", data: post });
    } catch (error: any) {
      console.error("Error:", error.message);
      res.status(500).json({ message: error.message });
    }
  },

  // Fetching All Likes
  getAllLikes: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const post: IPost | null = await Post.findOne({ id: Number(id) });

      if (!post) {
        res.status(404).json({ message: "Post not found!" });
        return;
      }

      res.status(200).json({ likes: post.likesCount });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  // Deleting All Likes
  clearAllLikes: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const post: IPost | null = await Post.findOne({ id: Number(id) });
      console.log(post);

      if (!post) {
        res.status(404).json({ message: "Post not found!" });
      }

      console.log("Current Likes Array:", post?.likes);

      if (post != null) {
        post.likes = [];
        post.likesCount = 0;

        await post.save();
        console.log("Likes cleared. Updated Likes Array:", post.likes);
      } else {
        console.log("post is null");
      }

      res.status(200).json({ message: "All likes cleared successfully!" });
    } catch {
      console.error("Error clearing likes:");
      res
        .status(500)
        .json({ message: "An error occurred while clearing likes!" });
    }
  },

  // Commenting on the Post
  commentOnPost: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { text } = req.body;
      const { username } = req.body;
      const now = new Date();

      const post: IPost | null = await Post.findOne({ id: Number(id) });

      if (!post) {
        res.status(404).json({ message: "Post not found!" });
        return;
      }

      commentCounter++;
      const userId = commentCounter;

      post.comments.push({ userId, text, dat: now });
      await post.save();

      res
        .status(200)
        .json({ message: "Comment added successfully!", data: post });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  // Fetching All Comments
  getAllComments: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const post: IPost | null = await Post.findOne({ id: Number(id) });

      if (!post) {
        res.status(404).json({ message: "Post not found!" });
        return;
      }

      res.status(200).json({ comments: post.comments });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  // Deleting All Comments
  deleteAllComments: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const post: IPost | null = await Post.findOne({ id: Number(id) });

      if (!post) {
        res.status(404).json({ message: "Post not found!" });
        return;
      }

      post.comments = [];
      await post.save();

      res.status(200).json({ message: "All comments deleted successfully!" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default PostController;
