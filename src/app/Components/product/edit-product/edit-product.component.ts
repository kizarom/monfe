import {Component, OnInit} from '@angular/core';
import {Product} from '../../../Models/product';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ProductApiService} from '../../../Services/product-api.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

  product: Product;
  editForm: FormGroup;
  submitted = false;
  id: any;
  imagePath: any;
  error: string[] = [];
  image: File;
  imageDeleted: any;

  constructor(private productApiService: ProductApiService,
              public activeModal: NgbActiveModal,
              private fb: FormBuilder) {
  }

  get f() {
    return this.editForm.controls;
  }

  get name() {
    return this.editForm.get('name');
  }

  get description() {
    return this.editForm.get('description');
  }

  get price() {
    return this.editForm.get('price');
  }

  get electric_power() {
    return this.editForm.get('electric_power');
  }

  get electrical_installation() {
    return this.editForm.get('electrical_installation');
  }

  get electrical_assembly() {
    return this.editForm.get('electrical_assembly');
  }

  get electrical_assembly_type() {
    return this.editForm.get('electrical_assembly_type');
  }

  get heat_production() {
    return this.editForm.get('heat_production');
  }

  get exchanger_number() {
    return this.editForm.get('exchanger_number');
  }

  get domestic_water_heating() {
    return this.editForm.get('domestic_water_heating');
  }

  get domestic_water_heating_way() {
    return this.editForm.get('domestic_water_heating_way');
  }

  get thermal_storage() {
    return this.editForm.get('thermal_storage');
  }

  get smart_r() {
    return this.editForm.get('smart_r');
  }

  ngOnInit(): void {
    this.id = this.product.id;
    this.editForm = this.fb.group({
      name: [this.product.name, Validators.required],
      description: [this.product.description, Validators.required],
      price: [this.product.price, Validators.required],
      electric_power: [this.product.electric_power, Validators.required],
      electrical_installation: [this.product.electrical_installation, Validators.required],
      electrical_assembly: [this.product.electrical_assembly, Validators.required],
      electrical_assembly_type: [this.product.electrical_assembly_type],
      heat_production: [this.product.heat_production, Validators.required],
      exchanger_number: [this.product.exchanger_number],
      domestic_water_heating: [this.product.domestic_water_heating, Validators.required],
      domestic_water_heating_way: [this.product.domestic_water_heating_way],
      thermal_storage: [this.product.thermal_storage, Validators.required],
      smart_r: [this.product.smart_r, Validators.required]
    });
  }

  onSelectedFile(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.image = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imagePath = reader.result as string;
        if (file == null) {
          this.editForm.patchValue({
            product_picture: reader.result
          });
        }
      };
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.editForm.invalid) {
      return;
    }
    const productData = new FormData();
    productData.append('picture_image', this.image);
    productData.append('productData', JSON.stringify(this.editForm.value));
    console.log(JSON.stringify(this.editForm.value));
    this.productApiService.editProduct(this.id, productData)
      .subscribe((response) => {
        console.log(response);
        this.activeModal.close();
      }, (error) => {
        console.log(error);
      });
  }
}
