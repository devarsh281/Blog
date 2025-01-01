import express, { Router } from "express";
import PostController from "../controllers/PostController";

const router: Router = express.Router();

router.post("/addpost", PostController.createPost);
router.get("/getAll", PostController.getAllPosts); 
router.get("/getID/:id", PostController.getPostByID);
router.put("/updatepost/:id", PostController.updatePost);
router.delete("/delpost/:id", PostController.deletePost);

export default router;
