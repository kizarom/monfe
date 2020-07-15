import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommandeApiService {
  private baseUrl = 'http://127.0.0.1:8000/api/commandes';

  constructor(private http: HttpClient) { }

  getCommandesList() {
    return this.http.get(this.baseUrl);
  }
  updateStatus(status:string, id:any) {
    return this.http.put("http://localhost:8000/api/commande/update/status/"+id, status);
  }
}
