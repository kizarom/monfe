import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../Models/project';




@Injectable({
  providedIn: 'root'
})

export class ProjectFilterService {

  constructor(private httpClient:HttpClient)  { }

  public projectFiltring(dataFilter: Project){
    return this.httpClient.post('http://localhost:8000/api/projectSearch', dataFilter);
  }

  public getAllProjects(){
    return this.httpClient.get('http://localhost:8000/api/projects');
  }

  public getProjectsByClient(){
    return this.httpClient.get('http://localhost:8000/api/projects/byClient');
  }

  public getAllSalsesQuotes(){
    return this.httpClient.get('http://localhost:8000/api/salesQuotes');
  }


}
