import { Contact } from './contact';

export interface Projet {
    id?: string;
    title: string;
    client: any;
    adress: string;
    city: string;
    postalcode: string;
    price: number;
}
