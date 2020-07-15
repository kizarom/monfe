import { Project } from './project';

export interface Contact {
  id?: any;
  email: string;
  roles: string[];
  password: string;
  first_name: string;
  last_name: string;
  avatar_path: string;
  created_at?: Date;
}
