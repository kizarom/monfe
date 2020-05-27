import {Component, OnInit} from '@angular/core';
import {Product} from '../../../Models/product';
import {ProductApiService} from '../../../Services/product-api.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-product',
  templateUrl: './show-product.component.html',
  styleUrls: ['./show-product.component.scss']
})
export class ShowProductComponent implements OnInit {
  id: string;
  product: Product;

  constructor(private productApiService: ProductApiService,
              public activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.productApiService.getProductById(this.id).subscribe((product: Product) => {
      this.product = product;
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
      confirmButtonText: 'Oui Supprimé'
    }).then((result) => {
      if (result.value) {
        this.productApiService.deleteProduct(id).subscribe(() => {
          Swal.fire(
            'supprimé!',
            'votre produit est supprimé avec succès',
            'success'
          );
          this.activeModal.close();
        });
      }
    });
  }

}
