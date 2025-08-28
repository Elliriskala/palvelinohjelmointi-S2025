import {Types, Model} from 'mongoose';
import {Point, Polygon} from 'geojson';

type Species = {
  species_name: string;
  category: Types.ObjectId;
  location: Point;
  image: string;
};

type SpeciesModel = Model<Species> & {
  findByArea(area: Polygon): Promise<Species[]>;
};

export {Species, SpeciesModel};
