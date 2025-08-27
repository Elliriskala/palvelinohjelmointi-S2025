import {NextFunction, Request, Response} from 'express';
import {Category} from '../../types/Category';
import {MessageResponse} from '../../types/Messages';
import categoryModel from '../models/categoryModel';
import CustomError from '../../classes/CustomError';

type DBMessageResponse = MessageResponse & {
  data: Category;
};

// post a category
const postCategory = async (
  req: Request<{}, {}, Category>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  const newCategory = new categoryModel(req.body);
  try {
    // create the new category
    const savedCategory = await newCategory.save();
    res.status(201).json({
      message: 'Category created successfully',
      data: savedCategory,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// get all categories
const getCategories = async (
  req: Request,
  res: Response<Category[]>,
  next: NextFunction,
) => {
  try {
    // find all categories
    res.json(await categoryModel.find());
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// get a single category
const getCategory = async (
  req: Request<{id: string}>,
  res: Response<Category>,
  next: NextFunction,
) => {
  try {
    // find category by its ID
    const category = await categoryModel.findById(req.params.id);

    // if category not found handle the 404 error
    if (!category) {
      next(new CustomError('Category not found', 404));
      return;
    }
    res.json(category);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// update category
const putCategory = async (
  req: Request<{id: string}, {}, Category>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    // update category by finding and updating it based on its ID
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
    );
    if (!updatedCategory) {
      next(new CustomError('Category not found', 404));
      return;
    }
    res.json({message: 'Category updated', data: updatedCategory});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// delete category
const deleteCategory = async (
  req: Request<{id: string}>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const deleteCategory = await categoryModel.findByIdAndDelete(req.params.id);

    if (!deleteCategory) {
      next(new CustomError('Category not found', 404));
      return;
    }

    res.json({
      message: 'Category deleted',
      data: deleteCategory,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export {postCategory, getCategories, getCategory, putCategory, deleteCategory};
