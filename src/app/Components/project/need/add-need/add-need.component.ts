import { Component, OnInit, AfterViewInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectApiService } from 'src/app/Services/project-api.service';

@Component({
  selector: 'app-add-need',
  templateUrl: './add-need.component.html',
  styleUrls: ['./add-need.component.scss']
})
export class AddNeedComponent implements OnInit , AfterViewInit{
  areas:any[] = [];
  areasData:any[] = [];
  currentAreaIndex = 0;
  isEditing = null;
  needs = [];
  needChanged = false;
  form: FormGroup;
  error: string[] = [];
  isProjectEditing:boolean = false;
  constructor(private router: Router,
              private fb: FormBuilder,
              private projectApiService: ProjectApiService) { }
              

  get f() {
    return this.form.controls;
  }

  get electric_power() {
    return this.form.get('electric_power');
  }

  get electric_setup() {
    return this.form.get('electric_setup');
  }

  get electric_collection() {
    return this.form.get('electric_collection');
  }

  get collection_type() {
    return this.form.get('collection_type');
  }

  get heating_production() {
    return this.form.get('heating_production');
  }

  get heating_number_bouche() {
    return this.form.get('heating_number_bouche');
  }

  get water_heating() {
    return this.form.get('water_heating');
  }

  get water_heating_way() {
    return this.form.get('water_heating_way');
  }

  get thermic_storage() {
    return this.form.get('thermic_storage');
  }

  get smart_r() {
    return this.form.get('smart_r');
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      electric_power: [0, Validators.required],
      electric_setup: ["", Validators.required],
      electric_collection: [false, Validators.required],
      collection_type: [""],
      heating_production: [false, Validators.required],
      heating_number_bouche: [0],
      water_heating: [false, Validators.required],
      water_heating_way: [""],
      thermic_storage: [false, Validators.required],
      smart_r: [false, Validators.required],
    });
    if(sessionStorage.getItem('areas')) {
      this.areas = JSON.parse(sessionStorage.getItem('areas'));
    }else {
      this.router.navigateByUrl("/create/project/areas"); 
    }
    if(sessionStorage.getItem('isUpdate') && sessionStorage.getItem('isUpdate') === "true") this.isProjectEditing = true;
    this.onFormChanges();
    if(sessionStorage.getItem('needs')){
      this.needs = JSON.parse(sessionStorage.getItem('needs'));
    }
    if(sessionStorage.getItem('areasData')){
      this.areasData = JSON.parse(sessionStorage.getItem('areasData'));
      this.areasData.forEach(ad => {  
        if(!this.needs.find(need => need.areaTitle == ad.areaTitle)){
          this.needs.push({
              areaTitle: ad.areaTitle,      
              need: { electric_power:0,
                electric_setup: "",
                electric_collection: false,
                collection_type:"" ,
                heating_production: false,
                heating_number_bouche: 0,
                water_heating: false,
                water_heating_way: "",
                thermic_storage: false,
                smart_r: false,},
            });
        }
      });
      this.needs.forEach((need, index) => {
        if(!this.areasData.find(ad=> ad.areaTitle == need.areaTitle)){
          this.needs.splice(index, 1);
        }
      })
    }
    this.form.disable();
    if(sessionStorage.getItem('isUpdate') && sessionStorage.getItem('isUpdate') === "true") this.isProjectEditing = true;
  }

  onFormChanges(): void {
    this.form.valueChanges.subscribe(val => {
      if (this.isEditing && this.needChanged) {
        this.needs[this.currentAreaIndex].need = val;
      }
    });
  }


  ngAfterViewInit(): void {
    
    if(sessionStorage.getItem('areas')) {
      this.areas = JSON.parse(sessionStorage.getItem('areas'));
    }else {
      this.router.navigateByUrl("/create/project/areas"); 
    }
    this.onFormChanges();
    if(sessionStorage.getItem('needs')){
      this.needs = JSON.parse(sessionStorage.getItem('needs'));
    }
    if(sessionStorage.getItem('areasData')){
      this.areasData = JSON.parse(sessionStorage.getItem('areasData'));
      this.areasData.forEach(ad => {  
        if(!this.needs.find(need => need.areaTitle == ad.areaTitle)){
          this.needs.push({
              areaTitle: ad.areaTitle,      
              need: { electric_power:0,
                electric_setup: "",
                electric_collection: false,
                collection_type:"" ,
                heating_production: false,
                heating_number_bouche: 0,
                water_heating: false,
                water_heating_way: "",
                thermic_storage: false,
                smart_r: false,},
            });
        }
      });
      this.needs.forEach((need, index) => {
        if(!this.areasData.find(ad=> ad.areaTitle == need.areaTitle)){
          this.needs.splice(index, 1);
        }
      })
    }
    this.form.disable();
    if(sessionStorage.getItem('isUpdate') && sessionStorage.getItem('isUpdate') === "true") this.isProjectEditing = true;
  }

  showArea(area){
    if(this.isEditing == area.getAttribute('data-title')){
      area.style['box-shadow'] = "8px 5px 14px -6px rgb(0, 0, 0)";
      area.style['color'] = "black";
      area.classList.remove('bg-primary')
      $('#add_area').removeClass('is-disabled').addClass('add-area');
      this.needChanged = false;
      this.isEditing = null;
      this.form.reset();
      this.form.disable();
      return;
    }
    let children = document.querySelector(".created-areas-container").children;
    for (let i = 0; i < children.length; i++) {
      children[i]['style']['box-shadow'] = "8px 5px 14px -6px rgb(0, 0, 0)";
      children[i]['style']['color'] = "black";
      children[i].classList.remove('bg-primary')
    }
    this.isEditing = area.getAttribute('data-title');
    area.style['box-shadow'] = "none";
    area.style['color'] = "white";
    area.classList.add('bg-primary');
    this.form.enable();
    this.needChanged = false;
    this.form.reset();
    this.currentAreaIndex = this.needs.indexOf(this.needs.find(cf => cf.areaTitle == area.getAttribute('data-title')));  
    this.form.patchValue(this.needs[this.currentAreaIndex].need);
    this.needChanged = true;
  }

  goBack(){
    this.router.navigateByUrl("create/project/areas"); 
  }

  save() {
    sessionStorage.setItem('needs', JSON.stringify(this.needs));
    this.router.navigateByUrl("create/project/configurators"); 
  }
  
  update() {
    if(this.isProjectEditing){
      sessionStorage.setItem('needs', JSON.stringify(this.needs));
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

}

