import express from 'express';
import {
  getAllSpecies,
  getSpecies,
  postSpecies,
  putSpecies,
  deleteSpecies,
  findSpeciesByArea,
} from '../controllers/speciesController';

const router = express.Router();

// post a new species or get all species
router.route('/').post(postSpecies).get(getAllSpecies);

// find species by area
router.route('/area').post(findSpeciesByArea);

// get a single species, update or delete species by id
router.route('/:id').get(getSpecies).put(putSpecies).delete(deleteSpecies);

export default router;
