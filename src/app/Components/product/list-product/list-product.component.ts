import {Component, OnInit, NgModuleRef, AfterViewInit, ViewChild} from '@angular/core';
import {Product} from '../../../Models/product';
import {ProductApiService} from '../../../Services/product-api.service';
import {NgbModal, NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';
import {AddProductComponent} from '../add-product/add-product.component';
import Swal from 'sweetalert2';
import {EditProductComponent} from '../edit-product/edit-product.component';
import {ShowProductComponent} from '../show-product/show-product.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatatableConfigurationService } from 'src/app/Services/datatable-configuration.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent implements OnInit, AfterViewInit {

  products: Product[];
 
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  productTable: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();


  constructor(
    private productApiService: ProductApiService,
    protected modalService: NgbModal,
    private dataTableConfiguration: DatatableConfigurationService,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.spinner.show();
    this.getProductsList();
  }

  ngAfterViewInit(){
    this.spinner.hide();
    this.dtTrigger.next();
   }

  create() {
    const modalRef = this.modalService.open(AddProductComponent, {
      centered: true,
      backdrop: 'static',
      size: 'xl'
    });
    modalRef.result.then((yes) => {
      modalRef.close();
      this.getProductsList();
    }, (cancel) => {
      modalRef.close();
    });
  }

  show(id) {
    const modalRef = this.modalService.open(ShowProductComponent, {
      centered: true,
      backdrop: 'static',
      size: 'xl'
    });
    modalRef.componentInstance.id = id;
    modalRef.result.then((yes) => {
      modalRef.close();
      this.getProductsList();
    });
  }

  edit(product: Product) {
    const modalRef = this.modalService.open(EditProductComponent, {
      centered: true,
      backdrop: 'static',
      size: 'xl'
    });
    modalRef.componentInstance.product = product;
    modalRef.result.then((yes) => {
      modalRef.close();
      this.getProductsList();
    }, (cancel) => {
      modalRef.close();
    });
  }

  delete(id) {
    Swal.fire({
      title: 'Etes vous sûre de vouloir supprimer ce produit ?',
      text: 'vous ne pourrez pas récupérer ce produit',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Supprimer'
    }).then((result) => {
      if (result.value) {
        this.productApiService.deleteProduct(id).subscribe(() => {
          Swal.fire(
            'supprimé!',
            'votre produit est supprimé avec succès',
            'success'
          );
          this.getProductsList();
        });
      }
    });
  }

  private getProductsList() {
    this.productApiService.getProducts().subscribe((product: Product[]) => {
      this.products = product;
      console.log(product);
      this.productTable = this.dataTableConfiguration.getDatatableConfiguration();
    }, (error) => {
      console.log(error);
    });
  }
  

}
