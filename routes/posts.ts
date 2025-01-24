import express, { Router } from "express";
import PostController from "../controllers/PostController";
import multer from "multer";
import path from "path";

const router: Router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads"), 
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/addpost", PostController.createPost);
router.get("/getAll", PostController.getAllPosts);
router.get("/getID/:id", PostController.getPostByID);
router.put("/updatepost/:id", PostController.updatePost);
router.delete("/delpost/:id", PostController.deletePost);
router.post("/likepost/:id", PostController.likePost);
router.post("/comment/:id", PostController.commentOnPost);
router.get("/getcomment/:id", PostController.getAllComments);
router.get("/getlikes/:id", PostController.getAllLikes);
router.delete("/delcomment/:id", PostController.deleteAllComments);
router.delete("/dellikes/:id", PostController.clearAllLikes);
router.post("/upload-image", upload.single("file"), PostController.uploadImage);
router.get("/getimage/:file", PostController.getImage);

export default router;
