import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataTransferServiceService {

  constructor() { }

  public project= new BehaviorSubject<any>([]);
  cast= this.project.asObservable();

  sendAnything(data) {
    this.project.next(data);
  }
}
