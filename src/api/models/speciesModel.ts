import mongoose from 'mongoose';
import {Species, SpeciesModel} from '../../types/Species';
import {Polygon} from 'geojson';

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

// find all species within a certain area specified by a geoJson polygon
speciesSchema.statics.findByArea = function (area: Polygon) {
  return this.find({
    location: {
      $geoWithin: {
        $geometry: area,
      },
    },
  });
};

export default mongoose.model<Species, SpeciesModel>('Species', speciesSchema);
