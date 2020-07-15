import { Component, OnInit } from '@angular/core';
import {Orders} from '../../../Models/orders';
import {OrdersApiService} from '../../../Services/orders-api.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ProjectApiService} from '../../../Services/project-api.service';
import {Project} from '../../../Models/project';
import {SalesQotes} from '../../../Models/sales-qotes';

@Component({
  selector: 'app-check-orders',
  templateUrl: './check-orders.component.html',
  styleUrls: ['./check-orders.component.scss']
})
export class CheckOrdersComponent implements OnInit {
  id: string|number;
  project: Project;
  salesQote: SalesQotes;
  order: Orders = {
    client: 0,
    salse_quot: []
  };

  constructor(
    private orderApiService: OrdersApiService,
    public activeModal: NgbActiveModal,
    private projectApiService: ProjectApiService
  ) { }

  ngOnInit(): void {
    // this.id = this.project.id;
    this.projectApiService.findProject(this.id).subscribe((project: Project) => {
      this.project = project;
      console.log(project);
    }, (error) => {
      console.log(error);
    });
  }
  
  getDate(_date){
    var date = new Date(_date);
    var year = date.getFullYear();
    var month:any = date.getMonth()+1;
    var day:any = date.getDate()+1;

    if (day < 10) {
      day = '0' + day;
    }
    if (month < 10) {
      month = '0' + month;
    }

    return day + '-' + month + '-' + year
  }

  save(form) {
    if (form.valid) {
      // const orderData = new FormData();
      // orderData.append('client', this.project.client.id);
      // tslint:disable-next-line:prefer-for-of
      // for (let i = 0; i < this.project.sales_qotes.length; i++) {
      //   orderData.append('salseQuot', this.project.sales_qotes[i].id);
      // }
      var orderData = {
        salseQuot: this.project.sales_qotes[0].id,
      }
      this.orderApiService.addOrder(orderData).subscribe(
        (response) => {
          console.log(response);
          this.activeModal.close();
        }
      );
    }
  }



}
