import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Panel } from '../Models/panel';


@Injectable({
  providedIn: 'root'
})
export class PanelApiService {

  constructor(private httpClient:HttpClient) { }



  getAllPanel(){
    return this.httpClient.get('http://localhost:8000/api/panel');
  }

  getOnePanel(id: string){
    return this.httpClient.get(`http://localhost:8000/api/panel/${id}`);
  }

  addPanel(panel: Panel){
    return this.httpClient.post('http://localhost:8000/api/panel', panel);
  }

  editPanel(panel: Panel, id: string){
    return this.httpClient.put(`http://localhost:8000/api/panel/${id}`, panel);
  }

  deletePanel(id: string) {
    return this.httpClient.delete(`http://localhost:8000/api/panel/${id}`);
  }
}