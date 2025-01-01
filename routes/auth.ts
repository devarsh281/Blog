import express,{ Router } from "express";
import authController from "../controllers/authController";

const router:Router=express.Router();

router.post("/register",authController.register)
router.post("/log",authController.login)

export default router
