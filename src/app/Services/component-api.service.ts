import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ComponentApiService {

 
  constructor(private httpClient:HttpClient) { }

  getAllComponent(){
    return this.httpClient.get('http://localhost:8000/api/components/');
  }

  getOneComponent(id: number){
    return this.httpClient.get('http://localhost:8000/api/components/' + id);
  }

  addComponent(componentData: FormData){
    return this.httpClient.post('http://localhost:8000/api/components', componentData);
  }

  editComponent(componentData: FormData, id: number){
    return this.httpClient.post(`http://localhost:8000/api/components/${id}`, componentData, { params: { _method : 'PUT' }});
  }

  deleteComponent(id: string) {
    return this.httpClient.delete(`http://localhost:8000/api/components/${id}`);
  }
}
