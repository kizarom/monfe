import {Project} from './project';

export interface SalesQotes {
  id?: string;
  price: number;
  status: string;
  date: Date;
  path: string;
  project: Project;
}
