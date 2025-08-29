import {NextFunction, Request, Response} from 'express';
import {Animal} from '../../types/Animal';
import {MessageResponse} from '../../types/Messages';
import animalModel from '../models/animalModel';
import CustomError from '../../classes/CustomError';

type DBMessageResponse = MessageResponse & {
  data: Animal;
};

// post a animal
const postAnimal = async (
  req: Request<{}, {}, Animal>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  const newAnimal = new animalModel(req.body);
  try {
    // create the new animal
    const savedAnimal = await newAnimal.save();
    res.status(201).json({
      message: 'Animal created',
      data: savedAnimal,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// get all animals
const getAnimals = async (
  req: Request,
  res: Response<Animal[]>,
  next: NextFunction,
) => {
  try {
    // find all animals
    // exclude the __v field from the response
    // include the species and category information with population
    res.json(
      await animalModel
        .find()
        .select('-__v')
        .populate({
          path: 'species',
          select: '-__v',
          populate: {path: 'category', select: '-__v'},
        }),
    );
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// get a single animal
const getAnimal = async (
  req: Request<{id: string}>,
  res: Response<Animal>,
  next: NextFunction,
) => {
  try {
    // find animal by its ID
    // exclude the __v field from the response
    // include the species and category information with population
    const animal = await animalModel
      .findById(req.params.id)
      .select('-__v')
      .populate({
        path: 'species',
        select: '-__v',
        populate: {path: 'category', select: '-__v'},
      });

    // if animal not found handle the 404 error
    if (!animal) {
      next(new CustomError('Animal not found', 404));
      return;
    }
    res.json(animal);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// update animal
const putAnimal = async (
  req: Request<{id: string}, {}, Animal>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    // update animal by finding and updating it based on its ID
    const updatedAnimal = await animalModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedAnimal) {
      next(new CustomError('Animal not found', 404));
      return;
    }
    res.json({message: 'Animal updated', data: updatedAnimal});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// delete animal
const deleteAnimal = async (
  req: Request<{id: string}>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const deleteAnimal = await animalModel.findByIdAndDelete(req.params.id);

    if (!deleteAnimal) {
      next(new CustomError('Animal not found', 404));
      return;
    }

    res.json({
      message: 'Animal deleted',
      data: deleteAnimal,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// get animals within a box
const getAnimalsWithinBox = async (
  req: Request<{}, {}, {}, {topRight: string; bottomLeft: string}>,
  res: Response<Animal[]>,
  next: NextFunction,
) => {
  try {
    const topRight = req.query.topRight;
    const bottomLeft = req.query.bottomLeft;

    if (!topRight || !bottomLeft) {
      return next(new CustomError('Missing query parameters', 400));
    }

    // exclude the __v field from the response
    // include the species and category information with population
    const animals = await animalModel
      .find({
        location: {
          $geoWithin: {
            $box: [topRight.split(','), bottomLeft.split(',')],
          },
        },
      })
      .select('-__v')
      .populate({
        path: 'species',
        select: '-__v',
        populate: {path: 'category', select: '-__v'},
      });

    res.json(animals);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// find animal by species name
const getBySpeciesName = async (
  req: Request<{species_name: string}>,
  res: Response<Animal[]>,
  next: NextFunction,
) => {
  try {
    const animals = await animalModel.findBySpecies(req.params.species_name);
    res.json(animals);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export {
  postAnimal,
  getAnimals,
  getAnimal,
  putAnimal,
  deleteAnimal,
  getAnimalsWithinBox,
  getBySpeciesName,
};
