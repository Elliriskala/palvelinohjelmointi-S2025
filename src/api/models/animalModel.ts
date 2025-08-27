import mongoose from 'mongoose';
import {Animal} from '../../types/Animal';

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

export default mongoose.model<Animal>('Animal', animalSchema);
