import {Types, Model} from 'mongoose';
import {Point, Polygon} from 'geojson';
import { Category } from './Category';

type Species = {
  species_name: string;
  category: Types.ObjectId | Category;
  location: Point;
  image: string;
};

type SpeciesModel = Model<Species> & {
  findByArea(area: Polygon): Promise<Species[]>;
};

export {Species, SpeciesModel};
