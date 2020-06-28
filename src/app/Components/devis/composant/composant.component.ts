import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Product } from 'src/app/Models/product';
import { ComponentInterface } from 'src/app/Models/ComponentInterface';
import { Router } from '@angular/router';
import { ComponentApiService } from 'src/app/Services/component-api.service';
import { ProductApiService } from 'src/app/Services/product-api.service';
import { ProjectApiService } from 'src/app/Services/project-api.service';
import { ProjectsFilterComponent } from '../../projects-filter/projects-filter.component';

@Component({
  selector: 'app-composant',
  templateUrl: './composant.component.html',
  styleUrls: ['./composant.component.scss']
})
export class ComposantComponent implements OnInit, AfterViewInit {

  constructor(
    private router: Router,
    private componentService: ComponentApiService,
    private projectApiService: ProjectApiService

  ) { }


types = [
    { Id: '1', type:"Récepteur solaire", nonAsciType: "Recepteursolaire"},
    { Id: '2',  type:"Intégration", nonAsciType: "Integration"},
    { Id: '3', type:"Quincaillerie", nonAsciType: "Quincaillerie" },
    { Id: '4', type:"Aérolique", nonAsciType: "Aerolique" },
    { Id: '5', type:"Hydraulique", nonAsciType: "Hydraulique" },
    { Id: '6', type:"Electrique", nonAsciType: "Electrique" },
  ];

areas:any[] = [];
configurator:any[]=[];
areasData:any[] = [];
value1=[];
value2=[];
currentAreaIndex = 0;
composants = [{ 
    areaTitle: -1,
    test: [],
    product:[],
    selectedProduct: {}
}];
countComponentByType:any= {
  Recepteursolaire: 0,
  Integration: 0,
  Quincaillerie: 0,
  Aerolique: 0,
  Hydraulique: 0,
  Electrique: 0,

  reset: function() {
    this.Recepteursolaire = 0;
    this.Integration = 0;
    this.Quincaillerie = 0;
    this.Aerolique = 0;
    this.Hydraulique = 0;
    this.Electrique = 0;
  }
};
currentconfiguratorIndex = 0;
product:Product;
test:ComponentInterface;
array=[];
components: ComponentInterface[];
isEditing = null;
errorMessage:string;
id:number;
  ngOnInit() {  
    this.getListComponent();
  }
  getListComponent() {     
    this.componentService.getAllComponent().subscribe((componentsList: ComponentInterface[]) => {
      this.components = componentsList;
      console.log(componentsList);
      
    });
  }

ngAfterViewInit() {
  
  this.getListComponent();
  
  if(sessionStorage.getItem('areas')) {
    this.areas = JSON.parse(sessionStorage.getItem('areas'));
  }else this.router.navigateByUrl("/create/project/areas"); 


  if(sessionStorage.getItem('composants')){
    this.composants = JSON.parse(sessionStorage.getItem('composants'));
  }
  if(sessionStorage.getItem('areasData')){
    this.areasData = JSON.parse(sessionStorage.getItem('areasData'));
    this.areasData.forEach(ad => {
      if(!this.composants.find(comp => comp.areaTitle == ad.areaTitle)){
        this.composants.push({
            areaTitle: ad.areaTitle,
            test: [],
            product:[],
            selectedProduct: {}
          });
      }
    })
    this.composants.forEach((comp, index) => {
      if(!this.areasData.find(ad=> ad.areaTitle == comp.areaTitle)){
        this.composants.splice(index, 1);
      }
    })
  }
  if(sessionStorage.getItem('configurators')) {
    this.configurator = JSON.parse(sessionStorage.getItem('configurators'));
    this.id=JSON.parse(sessionStorage.getItem('configurators'))[0].kit.id;
  }
  console.log(this.composants);

 }



add(){
    console.log(this.test);
    
    this.value1 = this.array.concat(this.test);
    this.value2 = this.value2.concat(this.test);
    this.value2=this.value1.concat(this.value2.filter(x =>this.value1.every(y => y !== x)));
    this.product.components = this.value1.concat(this.product.components);
    this.composants[this.currentAreaIndex].test=this.value2;
    this.composants[this.currentAreaIndex].product=this.product.components;
    this.composants[this.currentAreaIndex].selectedProduct= this.configurator[this.currentconfiguratorIndex].kit.selected;
    this.composants[this.currentAreaIndex].selectedProduct['components'] = this.product.components;
    this.value1.forEach(cp=>{
      this.countComponentByType[cp.type]++;
    })
    this.test ={
      man_ref:"",
      rexel_ref:"",
      title:"",
      quantity:1,
      description:"",
      type:"",
      price:0,
    }
    
  }

delete(composant){
  this.product.components.splice(this.product.components.indexOf(composant), 1);
  this.value2.splice(this.value2.indexOf(composant), 1);
  this.countComponentByType[composant.type]--;
  
}

initializeArea(){
  this.test ={
    man_ref:"",
    rexel_ref:"",
    title:"",
    quantity:1,
    description:"",
    type:"",
    price:0,
  }
  this.countComponentByType.reset();
  this.value1=[];
  this.value2=[];
  this.product['components'] = [];


}

showArea(area){
  if(this.isEditing == area.getAttribute('data-title')){
    area.style['box-shadow'] = "8px 5px 14px -6px rgb(0, 0, 0)";
    area.style['color'] = "black";
    area.classList.remove('bg-primary')
    $('#add_area').removeClass('is-disabled').addClass('add-area');
    this.initializeArea();
    this.isEditing = null;
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
  area.classList.add('bg-primary')
  this.currentAreaIndex = this.composants.indexOf(this.composants.find(cf => cf.areaTitle == area.getAttribute('data-title')));  
  this.currentconfiguratorIndex = this.configurator.indexOf(this.configurator.find(cf => cf.areaTitle == area.getAttribute('data-title')));  
  
  this.id=this.configurator[this.currentconfiguratorIndex].kit.id;
  this.value2=this.composants[this.currentAreaIndex].test;
  this.countComponentByType.reset();
  this.product = this.configurator[this.currentconfiguratorIndex].kit.selected;   
     
  if(this.value2.length==0){    
    this.test ={
      man_ref:"",
      rexel_ref:"",
      title:"",
      quantity:1,
      description:"",
      type:"",
      price:0,
    }
    this.value1=[];
    this.value2=[];
  }else{
    this.product.components = this.composants[this.currentAreaIndex].product;
  }
  
  this.product.components.forEach((component)=> {
    this.countComponentByType[component['type']]++;
  })
     
    this.test ={
      man_ref:"",
      rexel_ref:"",
      title:"",
      quantity:1,
      description:"",
      type:"",
      price:0,
    }
    

}
  

save() {

  sessionStorage.setItem('composants', JSON.stringify(this.composants));
  let project = JSON.parse(sessionStorage.getItem('projet'));
  let areasData = JSON.parse(sessionStorage.getItem('areasData'));
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

  let areas = this.areas.map(ars=>{
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
    this.areas.forEach((ar)=>{
      let config = configuratorsData.find(cg => cg.areaTitle === ar.title);
      project.price += config.kit.selected.price;
    })
    
    this.composants.forEach(comps=>{
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

  if(sessionStorage.getItem('isUpdate') && sessionStorage.getItem('isUpdate') === "true"){
    this.projectApiService.editProject(projectData, JSON.parse(sessionStorage.getItem('idProject'))).subscribe(idQuot=>{
      this.router.navigateByUrl('create/project/summary');
    },
    error => {
      console.log(error);
      if(error.status == 409 && error.error == 'Ce project existe déjà') 
        this.errorMessage = "Ce project existe déjà !"
    });
  }else {
      this.projectApiService.addProject(projectData).subscribe(idQuot=>{
      sessionStorage.setItem('idQuote',idQuot.toString());
      this.router.navigateByUrl('create/project/summary');
  },
  error => {
    console.log(error);
    
    if(error.status == 409 && error.error == 'Ce project existe déjà') 
      this.errorMessage = "Ce project existe déjà !"
  });
  }



}

dismissAlert(){
  this.errorMessage = null;
}

goBack(){
  this.router.navigateByUrl('create/project/configurators')
}


}
  

