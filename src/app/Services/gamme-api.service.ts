
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Gamme } from '../Models/gamme';


@Injectable({
  providedIn: 'root'
})
export class GammeApiService {

  constructor(private httpClient:HttpClient) { }



  getAllGamme(){
    return this.httpClient.get('http://localhost:8000/api/gammes');
  }

  getOneGamme(id: string){
    return this.httpClient.get(`http://localhost:8000/api/gammes/${id}`);
  }

  addGamme(gamme: Gamme){
    return this.httpClient.post('http://localhost:8000/api/gammes', gamme);
  }

  editGamme(gamme: Gamme, id: string){
    return this.httpClient.put(`http://localhost:8000/api/gammes/${id}`, gamme);
  }

  deleteGamme(id: string) {
    return this.httpClient.delete(`http://localhost:8000/api/gammes/${id}`);
  }
}
