import {NextFunction, Request, Response} from 'express';
import {Species} from '../../types/Species';
import {MessageResponse} from '../../types/Messages';
import speciesModel from '../models/speciesModel';
import CustomError from '../../classes/CustomError';
import {Polygon} from 'geojson';

type DBMessageResponse = MessageResponse & {
  data: Species;
};

// post a species
const postSpecies = async (
  req: Request<{}, {}, Species>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  const newSpecies = new speciesModel(req.body);
  try {
    // create the new species
    const savedSpecies = await newSpecies.save();
    res.status(201).json({
      message: 'Species created',
      data: savedSpecies,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// get all species
const getAllSpecies = async (
  req: Request,
  res: Response<Species[]>,
  next: NextFunction,
) => {
  try {
    // find all categories
    // exclude the __v field from the response
    // include the category information with population
    res.json(
      await speciesModel
        .find()
        .select('-__v')
        .populate({path: 'category', select: '-__v'}),
    );
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// get a single species
const getSpecies = async (
  req: Request<{id: string}>,
  res: Response<Species>,
  next: NextFunction,
) => {
  try {
    // find species by its ID
    // exclude the __v field from the response
    // include the category information with population
    const species = await speciesModel
      .findById(req.params.id)
      .select('-__v')
      .populate({path: 'category', select: '-__v'});

    // if species not found handle the 404 error
    if (!species) {
      next(new CustomError('Species not found', 404));
      return;
    }
    res.json(species);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// update species
const putSpecies = async (
  req: Request<{id: string}, {}, Species>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    // update species by finding and updating it based on its ID
    const updatedSpecies = await speciesModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSpecies) {
      next(new CustomError('Species not found', 404));
      return;
    }
    res.json({message: 'Species updated', data: updatedSpecies});
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// delete species
const deleteSpecies = async (
  req: Request<{id: string}>,
  res: Response<DBMessageResponse>,
  next: NextFunction,
) => {
  try {
    const deleteSpecies = await speciesModel.findByIdAndDelete(req.params.id);

    if (!deleteSpecies) {
      next(new CustomError('Species not found', 404));
      return;
    }

    res.json({
      message: 'Species deleted',
      data: deleteSpecies,
    });
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

// find species by area using POST with area in body
const findSpeciesByArea = async (
  req: Request<{}, {}, {polygon: Polygon}>,
  res: Response<Species[]>,
  next: NextFunction,
) => {
  try {
    const {polygon} = req.body;

    if (!polygon) {
      next(new CustomError('Missing polygon property in request body', 400));
      return;
    }

    if (!polygon.type || !polygon.coordinates) {
      next(new CustomError('Missing or invalid polygon structure', 400));
      return;
    }

    const species = await speciesModel.findByArea(polygon);
    res.json(species);
  } catch (error) {
    next(new CustomError((error as Error).message, 500));
  }
};

export {
  postSpecies,
  getAllSpecies,
  getSpecies,
  putSpecies,
  deleteSpecies,
  findSpeciesByArea,
};
