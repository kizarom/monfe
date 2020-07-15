import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrdersApiService {

  private baseUrl = 'http://127.0.0.1:8000/api/orders';

  constructor(private http: HttpClient) {
  }

  addOrder(order: any) {
    return this.http.post(this.baseUrl, order);
  }

  orderOneByProject(id: any, order: any) {
    return this.http.post(`${this.baseUrl}/${id}`, order);
  }

  orderProject(id: any, pid: any, order: any) {
    return this.http.post(`${this.baseUrl}/project/${pid}/${id}`, order);
  }

}
