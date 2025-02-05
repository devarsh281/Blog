import express,{ Router } from "express";
import authController from "../controllers/auth.controller";

const router:Router=express.Router();

router.post("/register",authController.register)
router.post("/log",authController.login)
router.post("/loguser",authController.loginUser)
router.get("/getusers",authController.getAllUsers)
router.get("/getuser/:username",authController.getUser)
router.delete("/deleteuser/:username",authController.deleteUser)

export default router
