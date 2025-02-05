import { Request, Response, NextFunction } from "express";
import Post, { IPost } from "../models/postmodel";
import Counter from "../models/counter";
import multer from "multer";
import path from "path";
import fs from "fs";
import { AppError } from "../middlewares/error.handlers";
import { PostValidationSchema } from "../models/postmodel";
import { z } from "zod";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
let commentCounter = 0;

const PostController = {
  createPost: async (req: Request, res: Response, next: NextFunction) => {
    PostValidationSchema.parse(req.body);

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
      return next(new AppError("Failed to generate Post ID", 500));
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
  },

  uploadImage: (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next(new AppError("File upload failed", 400));
    res.status(200).json({ location: `/uploads/${req.file.filename}` });
  },

  getImage: (req: Request, res: Response, next: NextFunction) => {
    const filePath = path.join(__dirname, "../uploads", req.params.file);
    if (!fs.existsSync(filePath))
      return next(new AppError("Image not found", 404));

    res.sendFile(filePath);
  },

  getAllPosts: (req: Request, res: Response, next: NextFunction) =>
    Post.find()
      .then((post) => {
        if (!post) throw new AppError("No Post found!", 404);
        res.status(200).json({ data: post });
      })
      .catch(next),

  getPostByID: (req: Request, res: Response, next: NextFunction) =>
    Post.findOne({ id: Number(req.params.id) })
      .then((post) => {
        if (!post) throw new AppError("Post not found!", 404);
        res.status(200).json(post);
      })
      .catch(next),

  updatePost: async (req: Request, res: Response, next: NextFunction) => {
    PostValidationSchema.parse(req.body);

    Post.findOneAndUpdate({ id: Number(req.params.id) }, req.body, {
      new: true,
    })
      .then((updatedPost) => {
        if (!updatedPost) {
          return next(new AppError("Post not found", 404));
        }
        res.status(200).json({ message: "Post updated", data: updatedPost });
      })
      .catch(next);
  },

  deletePost: (req: Request, res: Response, next: NextFunction) =>
    Post.findOneAndDelete({ id: Number(req.params.id) })
      .then((deletedPost) => {
        if (!deletedPost) throw new AppError("Post not found", 404);
        res.status(200).json({ message: "Post deleted" });
      })
      .catch(next),

  likePost: (req: Request, res: Response, next: NextFunction) =>
    Post.findOne({ id: Number(req.params.id) })
      .then((post) => {
        if (!post) throw new AppError("Post not found!", 404);

        const { username } = req.body;
        post.likes.includes(username)
          ? (post.likes = post.likes.filter((like) => like !== username))
          : post.likes.push(username);

        post.likesCount = post.likes.length;
        return post.save();
      })

      .then((updatedPost) => {
        res.status(200).json({ message: "Post liked!", data: updatedPost });
      })
      .catch(next),

  getAllLikes: (req: Request, res: Response, next: NextFunction) =>
    Post.findOne({ id: Number(req.params.id) })
      .then((post) => {
        if (!post) throw new AppError("Post not found!", 404);
        res.status(200).json({ likes: post.likesCount });
      })
      .catch(next),

  clearAllLikes: (req: Request, res: Response, next: NextFunction) =>
    Post.findOne({ id: Number(req.params.id) })
      .then((post) => {
        if (!post) throw new AppError("Post not found!", 404);

        post.likes = [];
        post.likesCount = 0;
        return post.save();
      })
      .then(() => {
        res.status(200).json({ message: "All likes deleted!" });
      })
      .catch(next),

  commentOnPost: (req: Request, res: Response, next: NextFunction) =>
    Post.findOne({ id: Number(req.params.id) })
      .then((post) => {
        if (!post) throw new AppError("Post not found!", 404);

        commentCounter++;
        post.comments.push({
          userId: commentCounter,
          text: req.body.text,
          dat: new Date(),
        });
        return post.save();
      })

      .then((updatedPost) => {
        res.status(200).json({ message: "Comment Added!", data: updatedPost });
      })
      .catch(next),

  getAllComments: (req: Request, res: Response, next: NextFunction) =>
    Post.findOne({ id: Number(req.params.id) })
      .then((post) => {
        if (!post) throw new AppError("Post not found!", 404);
        res.status(200).json({ comments: post.comments });
      })
      .catch(next),

  deleteAllComments: (req: Request, res: Response, next: NextFunction) =>
    Post.findOne({ id: Number(req.params.id) })
      .then((post) => {
        if (!post) throw new AppError("Post not found!", 404);

        post.comments = [];
        return post.save();
      })
      .then(() => {
        res.status(200).json({ message: "All comments deleted!" });
      })
      .catch(next),
};

export default PostController;
