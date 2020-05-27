import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {
  private baseUrl = 'http://localhost:8000/api/products';

  constructor(private http: HttpClient) {
  }

  getProducts() {
    return this.http.get(this.baseUrl);
  }

  getProductById(id) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  addProduct(product) {
    return this.http.post(this.baseUrl, product);
  }

  editProduct(id, product) {
    return this.http.post(`${this.baseUrl}/${id}`, product, { params: { _method : 'PUT' }});
  }

  deleteProduct(id) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
