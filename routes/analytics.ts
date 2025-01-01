import express,{ Router } from "express";
import analyticsController from "../controllers/analyticsController";

const router:Router=express.Router();

router.get("/analytics",analyticsController.getAnalysis)

export default router
