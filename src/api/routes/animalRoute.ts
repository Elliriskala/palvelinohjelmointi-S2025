import express from 'express';
import {
  getAnimals,
  getAnimal,
  postAnimal,
  putAnimal,
  deleteAnimal,
  getAnimalsWithinBox,
  getBySpeciesName,
} from '../controllers/animalController';

const router = express.Router();

// post a new animal or get all animals
router.route('/').post(postAnimal).get(getAnimals);

// get animals within a box
router.route('/location').get(getAnimalsWithinBox);

// get animals by species name
router.route('/species/:species_name').get(getBySpeciesName);

// get a single animal, update or delete animal by id
router.route('/:id').get(getAnimal).put(putAnimal).delete(deleteAnimal);

export default router;
