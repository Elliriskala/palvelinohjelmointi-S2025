import mongoose from 'mongoose';
import {Species} from '../../types/Species';

const speciesSchema = new mongoose.Schema<Species>({
  species_name: {
    type: String,
    required: true,
    unique: true,
    minLength: 2,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
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
  image: {
    type: String,
    required: true,
  },
});

export default mongoose.model<Species>('Species', speciesSchema);
