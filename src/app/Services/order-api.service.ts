import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../Models/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderApiService {

  constructor(private httpClient:HttpClient) { }

  filterOrder(order){
    return this.httpClient.post('http://localhost:8000/api/filter/order',order);
  }
  
  addOrder(order: Order){
    return this.httpClient.post('http://localhost:8000/api/orders', order);
  }
  getorderList(){
    return this.httpClient.get('http://localhost:8000/api/orders');
  }
  
  updateStatus(status, id){
    return this.httpClient.post('http://localhost:8000/api/orders/update/status/'+id, status);
  }
}
