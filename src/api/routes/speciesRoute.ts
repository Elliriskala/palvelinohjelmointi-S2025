import express from 'express';
import {
  getAllSpecies,
  getSpecies,
  postSpecies,
  putSpecies,
  deleteSpecies,
} from '../controllers/speciesController';

const router = express.Router();

// post a new species or get all species
router.route('/').post(postSpecies).get(getAllSpecies);

// get a single species, update or delete species by id
router.route('/:id').get(getSpecies).put(putSpecies).delete(deleteSpecies);

export default router;
