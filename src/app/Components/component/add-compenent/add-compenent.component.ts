import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ComponentInterface } from 'src/app/Models/ComponentInterface';
import { ComponentApiService } from 'src/app/Services/component-api.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-compenent',
  templateUrl: './add-compenent.component.html',
  styleUrls: ['./add-compenent.component.scss']
})
export class AddCompenentComponent implements OnInit {

  component: ComponentInterface = {
    man_ref:"",
    rexel_ref:"",
    title:"",
    quantity:1,
    description:"",
    type:"",
    price:0,
  };
  image: File;
  pdfs:File[] = [];
  errMessage: String[] = [];
  imagePreview: any = 'assets/image-default.png';
  constructor(    
    public activeModal: NgbActiveModal,
    public componentApiService: ComponentApiService,
    ) { }

  ngOnInit(): void {
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
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (_event) => {
      this.imagePreview = reader.result;
    };
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

  dismissAlert() {
    this.errMessage = [];
  }
  
  setImageDefault() {
    this.imagePreview = 'assets/image-default.png';
    this.image = null;
  }

  deleteFile(pdf){
    this.pdfs.splice(this.pdfs.indexOf(pdf), 1);
  }

  save(form) {
    if (form.valid) {
      const componentData = new FormData();

      componentData.append('image', this.image);
      componentData.append('component', JSON.stringify(this.component));
      for (let i = 0; i < this.pdfs.length; i++) {
        componentData.append('pd_f'+i,  this.pdfs[i]); 
      }

      this.componentApiService.addComponent(componentData).subscribe((resp) => {
        this.activeModal.close();
      });
    }
  }

}
