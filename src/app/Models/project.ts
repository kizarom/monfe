import { Contact } from './contact';
import { SalesQotes } from './sales-qotes';
import { Area } from './Area';
import { Need } from './need';
import { Configurator } from './configurator';
export interface Project {
  id?: number;
  title: string;
  adress: string;
  city?: string;
  status:string;
  postal_code?: number;
  price: number;
  created_at: Date;
  sales_qotes?: SalesQotes[];
  user?: Contact;
  client?: Contact;
  areas?: Area[];
  idClient?:number;
  configurators?: Configurator[];
  needs?: Need[];
  _areas?:any[];
  _areas_data?:any[];
  _components_data?:any[];
  _configurtors_data?:any[];
  _needs_data?:any[];
  _project_data?:any[];
}
