import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Contact } from '../Models/contact';


@Injectable({
  providedIn: 'root'
})
export class ContactApiService {

  constructor(private httpClient:HttpClient) { }

 

  getAllContact(){
    return this.httpClient.get("http://localhost:8000/api/users");
  }

  getOneContact(id:string){
    return this.httpClient.get("http://localhost:8000/api/users/"+id);
  }

  addContact(contact:Contact){
    return this.httpClient.post("http://localhost:8000/api/register",contact);
  }
  editContact(contact:Contact,id:string){
    return this.httpClient.put(`http://localhost:8000/api/users/${id}`,contact)
  }

  deleteContact(id:string){
    return this.httpClient.delete(`http://localhost:8000/api/users/${id}`);
  }
}
