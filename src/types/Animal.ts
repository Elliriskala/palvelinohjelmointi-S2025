import {Point} from 'geojson';
import {Types} from 'mongoose';

type Animal = {
  animal_name: string;
  birthdate: Date;
  species: Types.ObjectId;
  location: Point;
};

export {Animal};
