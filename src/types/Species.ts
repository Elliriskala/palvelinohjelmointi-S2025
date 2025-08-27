import {Types} from 'mongoose';
import {Point} from 'geojson';

type Species = {
  species_name: string;
  category: Types.ObjectId;
  location: Point;
  image: string;
};

export {Species};
