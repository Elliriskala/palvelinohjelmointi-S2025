import express from 'express';
import {
  getCategories,
  getCategory,
  postCategory,
  putCategory,
  deleteCategory,
} from '../controllers/categoryController';

const router = express.Router();

// post a new category or get all categories
router.route('/').post(postCategory).get(getCategories);

// get a single category, update or delete category by id
router.route('/:id').get(getCategory).put(putCategory).delete(deleteCategory);

export default router;
