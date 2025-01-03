import express, { Router } from "express";
import CategoryController from '../controllers/CategoryController';

const router:Router=express.Router();

router.post("/addcategory",CategoryController.createCategory);
router.get("/getAll",CategoryController.getAll);
router.get("/getcategory/:id",CategoryController.getCategoryByID);
router.put("/updatecategory/:id",CategoryController.updateCategory);
router.delete("/delcategory/:id",CategoryController.deleteCategory);


export default router