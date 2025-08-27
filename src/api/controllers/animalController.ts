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
      message: 'Animal created successfully',
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
    res.json(await animalModel.find());
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
    const animal = await animalModel.findById(req.params.id);

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

// get animals by location
const getAnimalsByLocation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const topRight = req.query.topRight as string;
    const bottomLeft = req.query.bottomLeft as string;

    if (!topRight || !bottomLeft) {
      return next(new CustomError('Missing query parameters', 400));
    }

    // Api lat, lon
    // Mongo uses [lon, lat]
    // --> parse and swap coordinates for MongoDB
    const [topRightLat, topRightLon] = topRight.split(',').map(Number);
    const [bottomLeftLat, bottomLeftLon] = bottomLeft.split(',').map(Number);

    if ([topRightLat, topRightLon, bottomLeftLat, bottomLeftLon].some(isNaN)) {
      return next(
        new CustomError('Invalid coordinate format, use lat,lon format', 400),
      );
    }

    const bottomLeftPoint: [number, number] = [bottomLeftLon, bottomLeftLat];
    const topRightPoint: [number, number] = [topRightLon, topRightLat];

    // debug log to see the coordinates
    console.log('Using $box with:', bottomLeftPoint, topRightPoint);

    const animals = await animalModel.find({
      location: {
        $geoWithin: {
          $box: [bottomLeftPoint, topRightPoint],
        },
      },
    });

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
  getAnimalsByLocation,
};
