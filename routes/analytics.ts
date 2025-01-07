import express,{ Router } from "express";
import analyticsController from "../controllers/analyticsController";


const router:Router=express.Router();

router.get("/analytics",analyticsController.getAnalysis)
router.get("/updateviews/:id",analyticsController.viewCount)

export default router
