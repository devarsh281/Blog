import { NextFunction, Request, Response } from "express";
import CatCounter, { Icount } from "../models/catcounter";
import Category, { CatValSchema, Icat } from "../models/catmodel";
import { AppError } from "../middlewares/error.handlers";

const CategoryController = {
  createCategory: async (req: Request, res: Response, next: NextFunction) => {
    CatValSchema.parse(req.body);

    const { name } = req.body;
    const categoryCount = await CatCounter.countDocuments();
    let cat;

    if (categoryCount === 0) {
      cat = await CatCounter.findOneAndUpdate(
        { name: "CatID" },
        { value: 1 },
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
      return next(new AppError("Failed to generate Category ID", 500));
    }

    const newCategory: Icat = new Category({ id: cat.value, name });
    await newCategory.save();
    res
      .status(201)
      .json({ message: "Category created successfully!", data: newCategory });
  },

  getAll: async (req: Request, res: Response, next: NextFunction) =>
    Category.find()
      .then((cat) => {
        if (!cat) throw new AppError("No Category found!", 404);
        res.status(200).json({ data: cat });
      })
      .catch(next),

  getCategoryByID: async (req: Request, res: Response, next: NextFunction) =>
    Category.findOne({ id: Number(req.params.id) })
      .then((cat) => {
        if (!cat) throw new AppError("Category not found!", 404);
        res.status(200).json(cat);
      })
      .catch(next),

  updateCategory: async (req: Request, res: Response, next: NextFunction) => {
    CatValSchema.parse(req.body);
    Category.findOneAndUpdate({ id: Number(req.params.id) }, req.body, {
      new: true,
    })
      .then((updateCat) => {
        if (!updateCat) {
          return next(new AppError("Category not found", 404));
        }
        res.status(200).json({ message: "Category updated", data: updateCat });
      })
      .catch(next);
  },

  deleteCategory: async (req: Request, res: Response, next: NextFunction) =>
    Category.findOneAndDelete({ id: Number(req.params.id) })
      .then((delCat) => {
        if (!delCat) throw new AppError("Category not found", 404);
        res.status(200).json({ message: "Category deleted" });
      })
      .catch(next),
};

export default CategoryController;
