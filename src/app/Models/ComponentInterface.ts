export interface ComponentInterface {
   id?:number,
   man_ref:string,
   rexel_ref:string,
   title:string,
   quantity:number,
   description:string,
   type:string,
   price:number,
   image?: string,
   files?: any[],
   date?:Date,
}
