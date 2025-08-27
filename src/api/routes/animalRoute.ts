import express from 'express';
import {
  getAnimals,
  getAnimal,
  postAnimal,
  putAnimal,
  deleteAnimal,
  getAnimalsByLocation,
} from '../controllers/animalController';

const router = express.Router();

// post a new animal or get all animals
router.route('/').post(postAnimal).get(getAnimals);

// get animals by location
router.route('/location').get(getAnimalsByLocation);

// get a single animal, update or delete animal by id
router.route('/:id').get(getAnimal).put(putAnimal).delete(deleteAnimal);

export default router;
