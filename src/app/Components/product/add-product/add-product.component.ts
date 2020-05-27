import {Component, OnInit} from '@angular/core';
import {ProductApiService} from '../../../Services/product-api.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Product} from '../../../Models/product';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  submitted = false;
  product: Product;
  form: FormGroup;
  uploadError: string;
  imagePath: any;
  error: string[] = [];
  image: File;

  constructor(private productApiService: ProductApiService,
              public activeModal: NgbActiveModal,
              private fb: FormBuilder) {
  }

  get f() {
    return this.form.controls;
  }

  get name() {
    return this.form.get('name');
  }

  get description() {
    return this.form.get('description');
  }

  get price() {
    return this.form.get('price');
  }

  get electric_power() {
    return this.form.get('electric_power');
  }

  get electrical_installation() {
    return this.form.get('electrical_installation');
  }

  get electrical_assembly() {
    return this.form.get('electrical_assembly');
  }

  get electrical_assembly_type() {
    return this.form.get('electrical_assembly_type');
  }

  get heat_production() {
    return this.form.get('heat_production');
  }

  get exchanger_number() {
    return this.form.get('exchanger_number');
  }

  get domestic_water_heating() {
    return this.form.get('domestic_water_heating');
  }

  get domestic_water_heating_way() {
    return this.form.get('domestic_water_heating');
  }

  get thermal_storage() {
    return this.form.get('thermal_storage');
  }

  get smart_r() {
    return this.form.get('smart_r');
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, Validators.required],
      electric_power: [0, Validators.required],
      electrical_installation: ['', Validators.required],
      electrical_assembly: [false, Validators.required],
      electrical_assembly_type: [''],
      heat_production: [false, Validators.required],
      exchanger_number: [0],
      domestic_water_heating: [false, Validators.required],
      domestic_water_heating_way: [''],
      thermal_storage: [false, Validators.required],
      smart_r: [false, Validators.required],
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
          this.form.patchValue({
            product_picture: reader.result
          });
        }
      };
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const productData = new FormData();
    productData.append('picture_image', this.image);
    productData.append('productData', JSON.stringify(this.form.value));
    this.productApiService.addProduct(productData)
      .subscribe((response) => {
        console.log(response);
        this.activeModal.close();
      }, (error) => {
        console.log(error);
      });
  }

}
