import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectApiService {
  private baseUrl = 'http://127.0.0.1:8000/api/projects';

  constructor(private http: HttpClient) { }

  getProjectsList() {
    return this.http.get(this.baseUrl);
  }

  findProject(id: any) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  addProject(project: FormData) {
    return this.http.post(this.baseUrl, project);
  }

  updateStatus(status:string, id:any) {
    return this.http.put("http://localhost:8000/api/project/update/status/"+id, status);
  }

  editProject(project: any, id: any) {
    return this.http.post(`${this.baseUrl}/${id}`, project, { params: { _method : 'PUT' }});
  }

  setQuoteFile(quoteFile, id) {
    return this.http.post("http://localhost:8000/api/salesQuote/setFile/"+id, quoteFile, { params: { _method : 'PUT' }});
  }

  deleteProduct(id: any) {
    return this.http.delete(`${this.baseUrl}/${id}`);

  }
}
