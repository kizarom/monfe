import { Component, OnInit } from '@angular/core';
import { PanelApiService } from 'src/app/Services/panel-api.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { Panel } from 'src/app/Models/panel';

@Component({
  selector: 'app-edit-panel',
  templateUrl: './edit-panel.component.html',
  styleUrls: ['./edit-panel.component.scss']
})
export class EditPanelComponent implements OnInit {
  panel: Panel;
  form: FormGroup;
  id: string;
  constructor(
    private panelservice:PanelApiService,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) { }
  get type() { return this.form.get('type') }
  get description() { return this.form.get('description') }
  get price() { return this.form.get('price') }

  ngOnInit(): void {
    this.setForm();
  }

  private setForm() {
    console.log(this.panel);

    this.id = this.panel.id;
    this.form = this.formBuilder.group({
      type: new FormControl(this.panel.type, [Validators.required]),
      description: new FormControl(this.panel.description, [Validators.required]),
      price: new FormControl(this.panel.price, [Validators.required]),
    });
  }

  edit() {
    if (this.form.valid) {
      console.log(this.form.value);
      this.panelservice
        .editPanel(this.form.value, this.id)
        .subscribe((resp) => {
          this.activeModal.close();
        });
    }
  }

}
