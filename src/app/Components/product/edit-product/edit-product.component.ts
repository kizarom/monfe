import {Component, OnInit} from '@angular/core';
import {Product} from '../../../Models/product';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ProductApiService} from '../../../Services/product-api.service';
import { Panel } from 'src/app/Models/panel';
import { PanelApiService } from 'src/app/Services/panel-api.service';

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
  panels:Panel[];
  linkedPanels: any = [];
  panelKit:string;
  constructor(private productApiService: ProductApiService,
              private panelApiService: PanelApiService,
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

  
  get kit() {
    return this.editForm.get('kit');
  }

  get price() {
    return this.editForm.get('price');
  }

  get rows() {
    return this.editForm.get('rows');
  }

  get columns() {
    return this.editForm.get('columns');
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
    this.getPanels();
    this.linkedPanels = this.product._panels_data.filter(lp => lp);
        
    this.panelKit = this.linkedPanels.map(lp => { return lp['number']+lp['type']}).toString();
    this.editForm = this.fb.group({
      name: [this.product.name, Validators.required],
      description: [this.product.description, Validators.required],
      price: [this.product.price, Validators.required],
      kit: [this.product.kit_description, Validators.required],
      rows: [this.product.grid_rows, Validators.required],
      columns: [this.product.grid_columns, Validators.required],
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

  getPanels(){
    this.panelApiService.getAllPanel().subscribe((panels:Panel[])=>{
      this.panels = panels;
    })
  }

  addPanel(panel, panelNumber){
    let inValid = false;
    panel.style.border = "none";
    panelNumber.style.border = "none";
    if(panel.selectedIndex === -1){
      panel.style.border = "1px solid red";
      inValid = true;
    }
    if(!panelNumber.value){
      panelNumber.style.border = "1px solid red";
      inValid = true;
    }
    if(inValid) return;
    let addPanel = this.panels.find(p=> p.id == panel.value)
    if(this.linkedPanels.map(lp=> {return lp['title'] }).includes(panel.options[panel.selectedIndex].text)){
      let i = this.linkedPanels.indexOf(this.linkedPanels.find(lp => lp['title'] === panel.options[panel.selectedIndex].text))
      this.linkedPanels[i].number = parseInt(this.linkedPanels[i].number) + parseInt(panelNumber.value);
      this.linkedPanels[i].price = addPanel.price * this.linkedPanels[i].number;
      console.log( this.linkedPanels);
      
      return;
    }
    this.linkedPanels.push({
      id: panel.value,
      type: panel.options[panel.selectedIndex].getAttribute('data-type'),
      title: panel.options[panel.selectedIndex].text,
      number: panelNumber.value,
      price: addPanel.price * panelNumber.value
    });
    console.log(this.linkedPanels);
    
    panelNumber.value = 1;
    this.panelKit = this.linkedPanels.map(lp => { return lp['number']+lp['type']}).toString();
  }

  deleteLinkedPanel(linkedPanel){
    this.linkedPanels.splice(this.linkedPanels.indexOf(linkedPanel), 1);
    this.panelKit = this.linkedPanels.map(lp => { return lp['number']+lp['type']}).toString();
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

  onSubmit(kitValue) {
    this.editForm.patchValue({
      kit: kitValue.value
    })    
    this.submitted = true;
    if (this.editForm.invalid) {
      return;
    }
    const productData = new FormData();
    productData.append('picture_image', this.image);
    productData.append('productData', JSON.stringify(this.editForm.value));
    productData.append('linkedPanls', JSON.stringify(this.linkedPanels));
    this.productApiService.editProduct(this.id, productData)
      .subscribe((response) => {
        this.activeModal.close();
      }, (error) => {
        console.log(error);
      });
  }
}
