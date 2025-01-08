import express, { Router } from "express";
import PostController from "../controllers/PostController";
import multer from "multer";
import path from "path";

const router: Router = express.Router();

const storage = multer.diskStorage({
    destination: path.join(__dirname, "../uploads"),
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  
  const upload = multer({ storage });

router.post("/addpost",upload.single("image"), PostController.createPost);
router.get("/getAll", PostController.getAllPosts); 
router.get("/getID/:id", PostController.getPostByID);
router.get("/images/:id", PostController.getImageByPostID);
router.put("/updatepost/:id", PostController.updatePost);
router.delete("/delpost/:id", PostController.deletePost);

export default router;
