import { Component, OnInit } from '@angular/core';
import { ComponentInterface } from 'src/app/Models/ComponentInterface';
import { ComponentApiService } from 'src/app/Services/component-api.service';
import { AuthApiService } from 'src/app/Services/auth-api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-compenent',
  templateUrl: './edit-compenent.component.html',
  styleUrls: ['./edit-compenent.component.scss']
})
export class EditCompenentComponent implements OnInit {

  constructor(
    private componentservice: ComponentApiService,
    public _authService: AuthApiService,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) { }
  component: ComponentInterface;
  image: File;
  pdfs:File[] = [];
  pdfsExist: any[] = [];
  deletedFilesIds:number[] = [];
  errMessage: String[] = [];
  imageDeleted: boolean = false;
  imagePreview: any = 'assets/image-default.png';
  id:number;
  isLoading = false;
  form: FormGroup;

  ngOnInit(): void {
    this.setForm();
  }
  
  get man_ref() { return this.form.get('man_ref'); }
  get rexel_ref() { return this.form.get('rexel_ref'); }
  get title() { return this.form.get('title') }
  get quantity() { return this.form.get('quantity') }
  get price() { return this.form.get('price') }
  get description() { return this.form.get('description') }
  get type() { return this.form.get('type') }

  private setForm() {
    this.id = this.component.id;
    this.imagePreview = this.component.image;
    this.pdfsExist.push.apply(this.pdfsExist, this.component['files']);
    this.form = this.formBuilder.group({
      man_ref: new FormControl(this.component.man_ref, [Validators.required]),
      rexel_ref: new FormControl(this.component.rexel_ref, [Validators.required]),
      title: new FormControl(this.component.title, [Validators.required]),
      quantity: new FormControl(this.component.quantity, [Validators.required, Validators.pattern('^[0-9]*$')]),
      price: new FormControl(this.component.price, [Validators.required, Validators.pattern('^([0-9]{1,10})(.[0-9]{1,2})?$')]),
      description: new FormControl(this.component.description, [Validators.required]),
      type: new FormControl(this.component.type, [Validators.required])
    });
  }

  getFiles(pdfs) {
    this.errMessage = [];
    if (!pdfs) { return; }    
    let error = false;    
    for(let i = 0; i < pdfs.length; i++){
       if (pdfs[i].type.match(/application\/pdf/) == null) {
         this.errMessage.push("- le fichier "+pdfs[i].name+" n'est de type .pdf !");
         error = true;
       }
       if (pdfs[i].size > 5000000) {
         this.errMessage.push('- La taille du fichier "'+pdfs[i].name+'" est plus de 5Mo !');
         error = true;
       }

    }
    if(error){
      return;
    }

    this.pdfs.push.apply(this.pdfs, pdfs);
  }

  deleteFile(pdf){
    this.pdfs.splice(this.pdfs.indexOf(pdf), 1);
  }

  deleteExistFile(pdfExist){
    this.pdfsExist.splice(this.pdfsExist.indexOf(pdfExist), 1);    
    this.deletedFilesIds.push(pdfExist.id);    
  }

  getImage(image) {
    if (!image) { return; }
    this.image = image;
    let type = this.image.type;
    let size: number = this.image.size;
    if (type.match(/image\/*/) == null) {
      this.errMessage.push('Seulement les images de type (.jpg, .jpeg, .png) sont supporter !');
      return;
    }
    if (size > 2000000) {
      this.errMessage.push('La taille de l\'image ne doit pas dépasser 2Mo !');
      return;
    }
    this.imageDeleted = true;
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (_event) => {
      this.imagePreview = reader.result;
    };
  }

  setImageDefault() {
    this.imagePreview = 'assets/image-default.png';
    this.image = null;
    this.imageDeleted = true;
  }

  dismissAlert() {
    this.errMessage = [];
  }

  edit() {
    if (this.form.valid) {
      this.isLoading = true;
      const componentData = new FormData();
      componentData.append('image', this.image);
      componentData.append('imageDeleted', JSON.stringify(this.imageDeleted));
      componentData.append('component', JSON.stringify(this.form.value));
      componentData.append('deletedFilesIds', JSON.stringify(this.deletedFilesIds));

      for (let i = 0; i < this.pdfs.length; i++) {
        componentData.append('pd_f'+i,  this.pdfs[i]); 
      }

      this.componentservice
        .editComponent(componentData, this.id)
        .subscribe((resp) => {          
          this.activeModal.close();
        });
    }
  }

}
