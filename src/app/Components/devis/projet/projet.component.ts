import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Contact } from 'src/app/Models/contact';
import { ContactApiService } from 'src/app/Services/contact-api.service';
import { Router } from '@angular/router';
import { Projet } from 'src/app/Models/projet';
import { AddContactComponent } from '../../contact/add-contact/add-contact.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProjectApiService } from 'src/app/Services/project-api.service';


@Component({
  selector: 'app-projet',
  templateUrl: './projet.component.html',
  styleUrls: ['./projet.component.scss']
})
export class ProjetComponent implements OnInit, AfterViewInit {
  st:boolean;
  projet:Projet={
    title: '',
    client:{},
    adress:"",
    city:"",
    postalcode:"",
    price: 0
  };
  idClient:any;
  isEditing:boolean = false;
  contacts:Contact[];
  constructor(private contactservice:ContactApiService,
    private router: Router,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private projectApiService: ProjectApiService
    ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.getListContacts();
    if(JSON.parse(sessionStorage.getItem("projet"))){
      this.projet = JSON.parse(sessionStorage.getItem("projet"));
      this.projet['price'] = 0;
      this.idClient  =  JSON.parse(sessionStorage.getItem("projet")).client.id;
    }
    if(sessionStorage.getItem('isUpdate') && sessionStorage.getItem('isUpdate') === "true") this.isEditing = true;
  }
  getListContacts(){
    this.contactservice.getAllContact().subscribe((contactList: Contact[])=>{
      this.contacts = contactList['hydra:member'].filter(contact => contact['roles'].includes('ROLE_USER'));
    })
  }
  save(form) {
    if (form.valid) {
      this.projet.client = this.contacts.find(contact=> contact.id == this.idClient);
      sessionStorage.setItem("projet",JSON.stringify(this.projet));
      this.router.navigateByUrl("create/project/areas");
    }
  }

  update() {
  if(this.isEditing){
    this.projet.client = this.contacts.find(contact=> contact.id == this.idClient);
    sessionStorage.setItem("projet",JSON.stringify(this.projet));
    let project = JSON.parse(sessionStorage.getItem('projet'));
    let areasData = JSON.parse(sessionStorage.getItem('areasData'));
    let areasDetails = JSON.parse(sessionStorage.getItem('areas'));
    let configuratorsData = JSON.parse(sessionStorage.getItem('configurators'));
    let componentsData = JSON.parse(sessionStorage.getItem('composants'));

    let windows  = areasData.map(areadata=> {
      let wins = areadata.windowChimneys.filter(wc => wc.type == 'window');
      return {areaTitle: areadata.areaTitle , windows: wins};
    }).filter(w=> w.windows.length != 0);

    let chimneys  = areasData.map(areadata=> {
      let chim = areadata.windowChimneys.filter(cm => cm.type == 'chimney');
      return {areatitle: areadata.areaTitle , chimneys: chim};
    }).filter(c=> c.chimneys.length != 0);

    let areas = areasDetails.map(ars=>{
      var w = windows.find(win=> win.areaTitle === ars.title);
      var c = chimneys.find(chm=> chm.areatitle === ars.title);
      if(w) ars['windows'] = w.windows;
      if(c) ars['chimneys'] = c.chimneys;
      return ars;
    })

    let components = componentsData.map(cmp=>{
      let prods = [];
      cmp.product.forEach(comp => {
        var i = prods.findIndex(p=> p.id == comp.id);
        if(i !== -1){
          prods[i].number++;
        }else {
          prods.push({id: comp.id, number:1})
        }
      });
      return {
        areaTitle: cmp.areaTitle,
        components: prods
      }
    })

    let configurators  = configuratorsData.map(conf=> {
      var comp = {}
      if(conf.areaTitle != "_blank") comp = components.find(cmp=> cmp.areaTitle === conf.areaTitle);
      return {
        areaTitle: conf.areaTitle,
        range: conf.range,
        electric_power: conf.electric_power,
        gridChoice: conf.gridChoice,
        solarFields: conf.kit.selected.grid_rows+'L'+conf.kit.selected.grid_columns+'C',
        panels: conf.kit.selected._panels_data,
        components: comp['components']
      };
    }).filter(conf=> conf.areaTitle != "_blank");

    if(project.price === 0){
      areasDetails.forEach((ar)=>{
        let config = configuratorsData.find(cg => cg.areaTitle === ar.title);
        project.price += config.kit.selected.price;
      })

      componentsData.forEach(comps=>{
        comps.product.forEach(comp => {
          project.price += comp.price;
        });
      })
      sessionStorage.setItem('projet', JSON.stringify(project));
    }

    var projectData = new FormData();
    projectData.append('project', sessionStorage.getItem('projet'));
    projectData.append('areas', JSON.stringify(areas));
    projectData.append('needs', sessionStorage.getItem('needs'));
    projectData.append('configurators', JSON.stringify(configurators));
    projectData.append('_areas', sessionStorage.getItem('areas'));
    projectData.append('_areas_data', sessionStorage.getItem('areasData'));
    projectData.append('_components_data', sessionStorage.getItem('composants'));
    projectData.append('_configurators_data', sessionStorage.getItem('configurators'));
    this.projectApiService.editProject(projectData, JSON.parse(sessionStorage.getItem('idProject'))).subscribe(idQuot=>{
      this.router.navigateByUrl('create/project/summary');
    });
  }else {
    this.router.navigateByUrl('projets');
  }



  }

  create() {
    const modalRef = this.modalService.open(AddContactComponent, {
      centered: true,
      backdrop: 'static'
    });
    modalRef.result.then(
      (yes) => {
        modalRef.close();
        this.spinner.show();
        this.contacts = null;
        this.getListContacts();
      },
      (cancel) => {
        modalRef.close();
      }
    );
  }
}
