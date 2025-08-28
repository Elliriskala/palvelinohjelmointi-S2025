import {Point} from 'geojson';
import {Types, Model} from 'mongoose';

type Animal = {
  animal_name: string;
  birthdate: Date;
  species: Types.ObjectId;
  location: Point;
};

type AnimalModel = Model<Animal> & {
  findBySpecies: (species: string) => Promise<Animal[]>;
};

export {Animal, AnimalModel};
