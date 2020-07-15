import { SalesQotes } from './sales-qotes';
import { ComponentInterface } from './ComponentInterface';
import { OrderComponentInterface } from './order-component-interface';

export interface Order {
    id?:string,
    type:String,
    status:String,
    project?:any,
    client?:any,
    created_at?:String,
    price?:number,
    salseQuot?:SalesQotes,
    components?: ComponentInterface[],
    ligncommands?:OrderComponentInterface[],
}
