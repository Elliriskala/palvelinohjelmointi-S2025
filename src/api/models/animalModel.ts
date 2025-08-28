import mongoose from 'mongoose';
import {Animal, AnimalModel} from '../../types/Animal';

const animalSchema = new mongoose.Schema<Animal>({
  animal_name: {
    type: String,
    required: true,
    unique: true,
    minLength: 2,
  },
  species: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Species',
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      require: true,
      index: '2dsphere',
    },
  },
});

animalSchema.statics.findBySpecies = function (species_name: string) {
  return this.aggregate([
    {
      $lookup: {
        from: 'species',
        localField: 'species',
        foreignField: '_id',
        as: 'species_info',
      },
    },
    {
      $match: {
        'species_info.species_name': species_name,
      },
    },
    {
      $project: {
        __v: 0,
        'species.info.__v': 0,
      },
    },
  ]);
};

export default mongoose.model<Animal, AnimalModel>('Animal', animalSchema);
