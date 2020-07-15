import {
  Component,
  OnInit,
  AfterViewInit,
  AfterViewChecked,
  DoCheck,
} from "@angular/core";
import { AuthApiService } from "src/app/Services/auth-api.service";
import { Order } from "src/app/Models/Order";
import { OrderApiService } from "src/app/Services/order-api.service";
import { DatatableConfigurationService } from "src/app/Services/datatable-configuration.service";
import { NgxSpinnerService } from "ngx-spinner";
import { DataTransferServiceService } from 'src/app/Services/data-transfer-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterCommandeComponent } from './filter-commande/filter-commande.component';
//import { Order } from 'src/app/Models/order';

@Component({
  selector: "app-commande",
  templateUrl: "./commande.component.html",
  styleUrls: ["./commande.component.scss"],
})
export class CommandeComponent implements OnInit, DoCheck {
  public isAdmin: boolean;
  status: string;
  commandes: Order[];
  componentsType = {
    Recepteursolaire: "Recepteur solaire",
    Integration: "Intégration",
    Quincaillerie: "Quincaillerie",
    Aerolique: "Aérolique",
    Hydraulique: "Hydraulique",
    Electrique: "Électrique",
  };
  isDone = false;
  constructor(
    private authApiService: AuthApiService,
    private orderService: OrderApiService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private dataTransfer: DataTransferServiceService,
    private dataTableConfiguration: DatatableConfigurationService
  ) {}

  commandeTable: DataTables.Settings = {};
  ngOnInit(): void {
    this.isAdmin = this.authApiService.getConnectedAdmin();
    this.isAdmin =
      this.authApiService.getConnectedAdmin() ||
      this.authApiService.isSuperAdmin();
    this.getcommandes();
  }

  ngDoCheck(): void {
    if (!this.isDone) {
      this.isAdmin = this.authApiService.getConnectedAdmin();
      this.isAdmin =
        this.authApiService.getConnectedAdmin() ||
        this.authApiService.isSuperAdmin();
      this.getcommandes();
      this.isDone = true;
    }
  }

  getcommandes() {
    this.spinner.show();
    this.orderService.getorderList().subscribe((orderList: Order[]) => {
      this.commandes = orderList;
      console.log(this.commandes);
      
      this.commandeTable = this.dataTableConfiguration.getDatatableConfiguration();
      this.spinner.hide();
    });
  }

  getTotalPrice(commandeLine) {
    return commandeLine
      .map((lc) => {
        return lc.price;
      })
      .reduce((p, n) => p + n, 0);
  }

  getTotalQuantity(commandeLine) {
    return commandeLine
      .map((lc) => {
        return lc.quantity;
      })
      .reduce((q, n) => q + n, 0);
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

  filter() {
    const modalRef = this.modalService.open(FilterCommandeComponent, {
      centered: true,
      backdrop: "static",
      size: "lg",
    });
    modalRef.result.then(
      () => {
        this.dataTransfer.project.subscribe((res) => {
          this.commandes = res;
          this.commandeTable = this.dataTableConfiguration.getDatatableConfiguration();
        });
        console.log(this.commandes);
        
        modalRef.close();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  save(objButton, id) {
    this.status = objButton.value;
    console.log(this.status);
    console.log(id);
    if (this.status == "Envoyer à l'ADV") this.status = "EnvoyerADV";
    console.log(this.status);
    this.orderService.updateStatus(this.status, id).subscribe(() => {
      this.getcommandes();
    });
  }

  ngOnDestroy(): void {
    this.isDone = false;
  }
}
