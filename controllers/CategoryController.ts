import { Request, Response } from "express";
import CatCounter, { Icount } from "../models/CategoryCounter";
import Category, { Icat } from "../models/CategoryModel";
import Post from "../models/PostModel";

const CategoryController = {
  createCategory: async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.body;
      const categoryCount = await CatCounter.countDocuments();
      let cat;

      if (categoryCount === 0) {
        cat = await CatCounter.findOneAndUpdate(
          { name: "CatID" },
          { value: 1  },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );
      } else {
        cat = await CatCounter.findOneAndUpdate(
          { name: "CatID" },
          { $inc: { value: 1 } },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );
      }

      if (!cat) {
        res.status(500).json({ message: "Failed to generate post ID" });
        return;
      }

      const newCategory: Icat = new Category({ id: cat.value, name });
      await newCategory.save();
      res.status(201).json({message: "Category created successfully!", data: newCategory  });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  getAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const category = await Category.find();
      // if (!data) {
      //   res.status(404).json({ message: "Category not found!" });
      //   return;
      // }
      res.status(200).json({ data :category});
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  getCategoryByID: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const cat: Icat | null = await Category.findOne({ id: Number(id) });

      if (!cat) {
        res.status(404).json({ message: "Category not found!" });
        return;
      }
      res.status(200).json( cat );
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },


  updateCategory: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const updateCat: Icat | null = await Category.findOneAndUpdate(
        { id },
        updatedData,
        {
          new: true,
        }
      );

      if (!updateCat) {
        res.status(404).json({ message: "Category Not Found" });
      }
      res
        .status(200)
        .json({ message: "Category Updated Successfully", data: updateCat });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteCategory: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const delCat: Icat | null = await Category.findOneAndDelete({ id });

      if (!delCat) {
        res.status(404).json({ message: "Category Not Found" });
      }
      res.status(200).json({ message: "Category Deleted Successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
};

export default CategoryController;
