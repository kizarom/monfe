export interface Contact {
   id?:string,
   email:string,
   roles:string[],
   password:string,
   first_name:string,
   last_name:string,
   avatar_path:string,
   createdAt?:Date,
}
