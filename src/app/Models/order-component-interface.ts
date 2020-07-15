import { Order } from './Order';
import { ComponentInterface } from 'src/app/Models/ComponentInterface';

export interface OrderComponentInterface {
    id?:number,
    command?:Order,
    component?:ComponentInterface,
    price?:number,
    quantity?:number,
}
