import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ComponentInterface } from 'src/app/Models/ComponentInterface';
import { ComponentApiService } from 'src/app/Services/component-api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductApiService } from 'src/app/Services/product-api.service';
import { Product } from 'src/app/Models/product';

@Component({
  selector: 'app-add-compenent',
  templateUrl: './add-compenent.component.html',
  styleUrls: ['./add-compenent.component.scss']
})
export class AddCompenentComponent implements OnInit {
  @ViewChild('labelcheckbox') labelcheckbox: ElementRef;
  component: ComponentInterface = {
    man_ref: '',
    rexel_ref: '',
    title: '',
    quantity: 1,
    description: '',
    type: '',
    price: 0,
    products: []
  };
  image: File;
  pdfs: File[] = [];
  errMessage: String[] = [];
  imagePreview: any = 'assets/image-default.png';
  products: Product;
  linkedProducts: number[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    public componentApiService: ComponentApiService,
    public productApiService: ProductApiService
    ) { }

  ngOnInit(): void {
    this.productApiService.getProducts().subscribe((products: Product) => {
        this.products = products;
    });
  }

  addProduct(product, label) {
    if (label.className.includes('active')) {
      label.classList.remove('active');
      this.component.products.splice(this.component.products.indexOf(product.id), 1);
    } else {
      label.classList.add('active');
      this.component.products.push(product.id);
    }
    console.log(this.component.products);
  }

  getImage(image) {
    if (!image) { return; }
    this.image = image;
    const type = this.image.type;
    const size: number = this.image.size;
    if (type.match(/image\/*/) == null) {
      this.errMessage.push('Seulement les images de type (.jpg, .jpeg, .png) sont supporter !');
      return;
    }
    if (size > 2000000) {
      this.errMessage.push('La taille de l\'image ne doit pas dépasser 2Mo !');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (_event) => {
      this.imagePreview = reader.result;
    };
  }

  getFiles(pdfs) {
    this.errMessage = [];
    if (!pdfs) { return; }
    let error = false;
    for (let i = 0; i < pdfs.length; i++) {
       if (pdfs[i].type.match(/application\/pdf/) == null) {
         this.errMessage.push('- le fichier ' + pdfs[i].name + ' n\'est de type .pdf !');
         error = true;
       }
       if (pdfs[i].size > 5000000) {
         this.errMessage.push('- La taille du fichier "' + pdfs[i].name + '" est plus de 5Mo !');
         error = true;
       }

    }
    if (error) {
      return;
    }

    this.pdfs.push.apply(this.pdfs, pdfs);
  }

  dismissAlert() {
    this.errMessage = [];
  }

  setImageDefault() {
    this.imagePreview = 'assets/image-default.png';
    this.image = null;
  }

  deleteFile(pdf) {
    this.pdfs.splice(this.pdfs.indexOf(pdf), 1);
  }

  save(form) {
    if (form.valid) {
      const componentData = new FormData();

      componentData.append('image', this.image);
      componentData.append('component', JSON.stringify(this.component));
      // componentData.append('products', JSON.stringify(this.linkedProducts));
      for (let i = 0; i < this.pdfs.length; i++) {
        componentData.append('pd_f' + i,  this.pdfs[i]);
      }

      this.componentApiService.addComponent(componentData).subscribe((resp) => {
        console.log(resp);

        this.activeModal.close();
      });
    }
  }

}
