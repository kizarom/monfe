import { Component, OnInit } from '@angular/core';
import { GammeApiService } from 'src/app/Services/gamme-api.service';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { Gamme } from 'src/app/Models/gamme';
import { AuthApiService } from 'src/app/Services/auth-api.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-gamme',
  templateUrl: './edit-gamme.component.html',
  styleUrls: ['./edit-gamme.component.scss']
})
export class EditGammeComponent implements OnInit{


  
  gamme: Gamme ;
  form: FormGroup;
  id: string;
  constructor(
    private gammeService: GammeApiService,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) {}

  get title() { return this.form.get('title') }


  ngOnInit(): void {
    this.setForm();
  }

  get editFormData() {
    return this.form.controls;
  }

  private setForm() {
    console.log(this.gamme);

    this.id = this.gamme.id;
    this.form = this.formBuilder.group({
      title: new FormControl(this.gamme.title, [Validators.required]),
    });
  }


  edit() {
    if (this.form.valid) {
      console.log(this.form.value);
      this.gammeService
        .editGamme(this.form.value, this.id)
        .subscribe((resp) => {
          this.activeModal.close();
        });
    }
  }

}
