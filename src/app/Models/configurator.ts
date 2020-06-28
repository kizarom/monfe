import { Panel } from './panel';
import { Gamme } from './gamme';
import { ComponentInterface } from './ComponentInterface';
export interface Configurator {
  id?: number;
  electric_power: number;
  gamme: Gamme;
  component: ComponentInterface[];
  panels: Panel[];
  grid_choice: string;
  solar_fields: string;
}
