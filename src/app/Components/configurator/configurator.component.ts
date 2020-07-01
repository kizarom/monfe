import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { GammeApiService } from 'src/app/Services/gamme-api.service';
import { Gamme } from 'src/app/Models/gamme';
import { ProductApiService } from 'src/app/Services/product-api.service';
import { Product } from 'src/app/Models/product';
import { PanelApiService } from 'src/app/Services/panel-api.service';
import { Panel } from 'src/app/Models/panel';
import { Router } from '@angular/router';
import { ProjectApiService } from 'src/app/Services/project-api.service';
declare var $:JQueryStatic;
@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.scss']
})
export class ConfiguratorComponent implements OnInit, AfterViewInit {

  constructor(
    private rangService: GammeApiService,
    private productService: ProductApiService,
    private panelService: PanelApiService,
    private router:Router,
    private projectApiService: ProjectApiService
  ) { }

  @ViewChild('areaBlock') areaBlock: ElementRef
  ranges: Gamme;
  products: Product[];
  panels: Panel[];
  scall:number = 70;
  area = {
        width:0.5,
        height:0.5,
      };
  selectedKit:any = {
    id: undefined,
    name: "",
    description: "",
    price: 0,
    kit_description:"",
    grid_rows:0,
    grid_columns:0,
    electric_power: 0,
    electrical_installation: "",
    electrical_assembly: false,
    electrical_assembly_type: "",
    heat_production: false,
    exchanger_number: false,
    domestic_water_heating: false,
    domestic_water_heating_way: false,
    thermal_storage: false,
    smart_r: false,
    components: [],
    product_image: "",
    _panels_data:[],
  };

  windowsChimneies = [];
  areas:any[] = [];
  areasData:any[] = [];
  types = {window: 'F', chimney: 'C'}
  cornersSize = {
    topLeft: {
      width:this.scall/2,
      height:this.scall/2
    },
    topRight: {
      width: this.scall/2,
      height: this.scall/2
    },
    bottomRight: {
      width: this.scall/2,
      height: this.scall/2
    },
    bottomLeft: {
      width: this.scall/2,
      height: this.scall/2
    },
  }
  cornersAction = {
    topLeft: false,
    topRight: false,
    bottomRight: false,
    bottomLeft: false,
  };
  panelSize = {
    width: 1,
    height: 1.6
  }
  panelsNumber;
  blocksList:Element[] = [];
  gridChoice = "v";
  isEditing = null;
  innerAreas = [];
  configurators = [{
    areaTitle: "_blank",
    range: "",
    kit: {
      id: -1,
      selected: {},
      _isCustom: false
    },
    electric_power: 0,
    gridChoice: "verticale"

  }];
  currentAreaIndex = 0;
  currentConfig = {
    areaTitle: "",
    range: "",
    kit: {
      id: -1,
      selected: this.selectedKit,
      _isCustom: false
    },
    electric_power: 0,
    gridChoice: "verticale"
  };
  isProjectEditing:boolean = false;

  ngOnInit() {    

  }

  ngAfterViewInit(): void {
    if(!sessionStorage.getItem("projet")){
      this.router.navigateByUrl("/create/project/info"); 
    }

    if(sessionStorage.getItem('areas')) {
      this.areas = JSON.parse(sessionStorage.getItem('areas'));
    }else {
      this.router.navigateByUrl("/create/project/areas"); 
    }

    if(sessionStorage.getItem('configurators')){
      this.configurators = JSON.parse(sessionStorage.getItem('configurators'));
    }
    
    if(sessionStorage.getItem('areasData')){
      this.areasData = JSON.parse(sessionStorage.getItem('areasData'));
      this.areasData.forEach(ad => {
        if(!this.configurators.find(conf => conf.areaTitle == ad.areaTitle)){
          this.configurators.push({
            areaTitle: ad.areaTitle,
            range: "",
            kit: {
              id: -1,
              selected: {},
              _isCustom: false
            },
            electric_power: 0,
            gridChoice: "verticale"
          });
        }
      })
      this.configurators.forEach((conf, index) => {
        if(!this.areasData.find(ad=> ad.areaTitle == conf.areaTitle) && conf.areaTitle != "_blank"){
          this.configurators.splice(index, 1);
        }
      })
      
    }

    this.getRanges();
    this.getProducts();
    this.getPanles();
    if(sessionStorage.getItem('isUpdate') && sessionStorage.getItem('isUpdate') === "true") this.isProjectEditing = true;
  }

  createInnerArea(area, innerArea = null){
    innerArea = $(document.createElement('div')).addClass('border border-info inner-area');
    $(area).append(innerArea);
    innerArea.append("<div class='resizer corner-bottom-right'></div>");
    innerArea.append('<div class="size-info" style="font-size: 7px;height: 100%;">'+
      '<p class="m-0 top-center">'+
        '<span class="width"></span></p>'+
      '<p class="m-0 left-center">'+
        '<span class="height"></span></p></div>');
    return innerArea;
  }

  changeGridChoice(choice, placeKitPanel = true){
    if(this.isEditing) {
      if(choice === 'verticale'){
        this.gridChoice = 'v';
        this.panelSize.width = 1;
        this.panelSize.height = 1.6;
      }

      if(choice === 'horizontale'){
        
        this.gridChoice = 'h';
        this.panelSize.width = 1.6;
        this.panelSize.height = 1;
      }
      this.panelsNumber = new Array(Math.floor(this.area.width/this.panelSize.width) * Math.floor(this.area.height/this.panelSize.height));      
      this.configurators[this.currentAreaIndex].gridChoice = choice;
      if(placeKitPanel){
        $('#loader_container').removeClass('d-none');
        setTimeout(()=>{
          this.is_colliding(document.getElementsByClassName('grid-line'), this.blocksList);
          this.placeKitsPanel(document.getElementsByClassName('grid-line'));
          $('#loader_container').addClass('d-none');
        }, 300);
      }
    }
  }
  getPanles(){
    this.panelService.getAllPanel().subscribe((panels: Panel[])=>{
      this.panels = panels;
    })
  }

  getRanges(){
    this.rangService.getAllGamme().subscribe((ranges: Gamme)=>{
      this.ranges = ranges;
    })
  }
  
  getProducts(){
    this.productService.getProducts().subscribe((products: Product[])=>{
      this.products = products;
      let option = new Option('Personnalisé', "0");
      $('#kit').append(option);
    })
  }
  

  changePanel(panelModal, i){
    let panel = document.getElementsByClassName('grid-line')[i];
    if ($(panel).hasClass('grid-border')) {
      panelModal.setAttribute("data-i", i); 
      $('#select_panel').val($(panel).html());
      panelModal.classList.add('d-flex');
    }

  }

  closePanelModal(panelModal){
    panelModal.classList.remove('d-flex');
  }

  refreshSelectedKit(){
    let panelData = this.selectedKit._panels_data;
    this.selectedKit = {
      id: 0,
      name: "",
      description: "",
      price: 0,
      kit_description:"Personnalisé",
      grid_rows:0,
      grid_columns:0,
      electric_power: 0,
      electrical_installation: "",
      electrical_assembly: false,
      electrical_assembly_type: "",
      heat_production: false,
      exchanger_number: false,
      domestic_water_heating: false,
      domestic_water_heating_way: false,
      thermal_storage: false,
      smart_r: false,
      components: [],
      product_image: "",
      _panels_data:[]};
    this.selectedKit._panels_data = panelData;
    this.configurators[this.currentAreaIndex].kit.selected = this.selectedKit;
    this.configurators[this.currentAreaIndex].kit.id = this.selectedKit.id;
    this.configurators[this.currentAreaIndex].kit._isCustom = true;
  }

  deletePanel(panelModal){
    let panel = document.getElementsByClassName('grid-line')[panelModal.getAttribute('data-i')];
    $("#kit").val(0); 
    this.refreshSelectedKit();
    if($(panel).hasClass('selected-panel')){      
      if(this.selectedKit._panels_data.map(lp=> {return lp['type'] }).includes($(panel).html())){
        let i = this.selectedKit._panels_data.indexOf(this.selectedKit._panels_data.find(lp => lp['type'] === $(panel).html()));
        let deletePanel = this.panels.find(pd=> pd.id == this.selectedKit._panels_data[i].id)
        this.selectedKit._panels_data[i].number--;
        this.selectedKit._panels_data[i].price = deletePanel.price * this.selectedKit._panels_data[i].number
      }
    }
    this.selectedKit.price = this.selectedKit._panels_data.map(pd=>{return pd.price}).reduce((p,n)=>p+n,0);
    console.log(this.selectedKit._panels_data );

    $(panel).empty();
    $(panel).append('<i class="fa fa-plus-circle" aria-hidden="true"></i>');
    $(panel).removeClass('selected-panel');
    panelModal.classList.remove('d-flex');
    this.refreshPanelGrid();
  }

  addPanel(panelModal, selectedPanel){
    let panel = document.getElementsByClassName('grid-line')[panelModal.getAttribute('data-i')];
    if($(panel).html() == selectedPanel.value) {panelModal.classList.remove('d-flex'); return;}    
    $(panel).empty();
    $(panel).html(selectedPanel.value);
    $("#kit").val(0);
    this.refreshSelectedKit();
    if(this.selectedKit._panels_data.map(lp=> {return lp['type'] }).includes(selectedPanel.value)){
      let i = this.selectedKit._panels_data.indexOf(this.selectedKit._panels_data.find(lp => lp['type'] === selectedPanel.value));
      this.selectedKit._panels_data[i].number++;
      this.selectedKit._panels_data[i].price = parseFloat($(selectedPanel.options[selectedPanel.selectedIndex]).attr('data-price')) * this.selectedKit._panels_data[i].number
    }else {      
      let addPanel = this.panels.find(pd=> pd.id == $(selectedPanel.options[selectedPanel.selectedIndex]).attr('data-id'))
      this.selectedKit._panels_data.push({
        id:  $(selectedPanel.options[selectedPanel.selectedIndex]).attr('data-id'),
        type: selectedPanel.value,
        title: selectedPanel.options[selectedPanel.selectedIndex].text,
        number: 1,
        price: addPanel.price
      })
    }
    this.selectedKit.price = this.selectedKit._panels_data.map(pd=>{return pd.price}).reduce((p,n)=>p+n,0);
    console.log(this.selectedKit._panels_data );

   
    $(panel).addClass('selected-panel');
    panelModal.classList.remove('d-flex');
    
    this.refreshPanelGrid();
    
  }
  refreshPanelGrid(){
    let panelIndex = 0;
    let cols = Math.floor(this.area.width/this.panelSize.width);
    let rows = Math.floor(this.area.height/this.panelSize.height);
    let grid = []
    let colCount = 0;
    for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if($(document.getElementsByClassName('grid-line')[panelIndex]).hasClass('selected-panel')){
        colCount++;
      }
      panelIndex++;
    }
    if (colCount !== 0) {
      grid[i] = colCount;
    }
    colCount = 0;
    panelIndex = Math.floor(this.area.width/this.panelSize.width)*(i+1);
    }
    this.selectedKit.grid_rows = grid.length;
    this.selectedKit.grid_columns = Math.max(...grid);
  }

  placeKitsPanel(panels:HTMLCollection){
    let panelsData = [];
    $('.grid-line').empty();
    $('.grid-border').append('<i class="fa fa-plus-circle" aria-hidden="true"></i>');
    $('.grid-line').removeClass('selected-panel');
    for (let i = 0; i < this.selectedKit._panels_data.length; i++) {
      for (let j = 0; j < this.selectedKit._panels_data[i].number; j++) {
        panelsData.push(this.selectedKit._panels_data[i].type);
      }
    }    
    let k = 0;
    let panelIndex = 0;
    let colToItirrat = this.selectedKit.grid_columns;
    let rows = Math.floor(this.area.height/this.panelSize.height);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < colToItirrat; j++) {        
        if($(panels[panelIndex]).hasClass('grid-border')){      
          if(panelsData[k] === undefined){
            continue;
          }
          $(panels[panelIndex]).empty();
          $(panels[panelIndex]).append(panelsData[k]);
          $(panels[panelIndex]).addClass('selected-panel');
          k++;
        }else {
          colToItirrat++;
        }
        panelIndex++;        
      }
      colToItirrat = this.selectedKit.grid_columns;
      panelIndex = Math.floor(this.area.width/this.panelSize.width) * (i+1);
    }
  }


  kitChange(kit){
    this.selectedKit = this.products.find(prd=> prd['id'] == kit.value);
    if(kit.value == 0){
      this.selectedKit = {
        id: 0,
      name: "",
      description: "",
      price: 0,
      kit_description:"Personnalisé",
      grid_rows:0,
      grid_columns:0,
      electric_power: 0,
      electrical_installation: "",
      electrical_assembly: false,
      electrical_assembly_type: "",
      heat_production: false,
      exchanger_number: false,
      domestic_water_heating: false,
      domestic_water_heating_way: false,
      thermal_storage: false,
      smart_r: false,
      components: [],
      product_image: "",
      _panels_data:[]
      };      
      this.selectedKit.price = this.selectedKit._panels_data.map(pd=>{return pd.price}).reduce((p,n)=>p+n,0);
      console.log(this.selectedKit._panels_data );
    }
    console.log(this.selectedKit);
    
    this.configurators[this.currentAreaIndex].kit._isCustom = (kit.value == 0);
    this.configurators[this.currentAreaIndex].electric_power = this.selectedKit.electric_power;
    this.configurators[this.currentAreaIndex].kit.id = this.selectedKit.id;
    this.configurators[this.currentAreaIndex].kit.selected = this.selectedKit;
    
    if(this.isEditing) this.placeKitsPanel(document.getElementsByClassName('grid-line'));
  
  }

  getPanelsCount(){
    return this.selectedKit._panels_data.map((lp)=> {return (lp) ? parseInt(lp.number) : 0}).reduce((p,n)=>p+n,0)
  }

  adaptKitTextsForPlural(text:string, number:number, word:string, inPlural:string){
    if(number > 1) return text.replace(word, inPlural);
    return text;
  }
  is_colliding(panels:HTMLCollection, blocks:Element[]) {
    for (let i = 0; i < panels.length; i++) {
      $(panels[i]).addClass('grid-border');
      $(panels[i]).removeClass('selected-panel');
      $(panels[i]).empty();
      $(panels[i]).append('<i class="fa fa-plus-circle" aria-hidden="true"></i>');
      var d1_offset             = $(panels[i]).offset();
      var d1_height             = $(panels[i]).outerHeight( true );
      var d1_width              = $(panels[i]).outerWidth( true );
      var d1_distance_from_top  = d1_offset.top + d1_height;
      var d1_distance_from_left = d1_offset.left + d1_width;
      for (let j = 0; j < blocks.length; j++) {           
        if($(blocks[j]).length){
          var d2_offset             = $(blocks[j]).offset();
          var d2_height             = $(blocks[j]).outerHeight( true );
          var d2_width              = $(blocks[j]).outerWidth( true );
          var d2_distance_from_top  = d2_offset.top + d2_height;
          var d2_distance_from_left = d2_offset.left + d2_width;
        
          var not_colliding = ( d1_distance_from_top < d2_offset.top || d1_offset.top > d2_distance_from_top || d1_distance_from_left < d2_offset.left || d1_offset.left > d2_distance_from_left );
          if(!not_colliding){
            $(panels[i]).removeClass('grid-border');
            $(panels[i]).empty();
          }
        }
      }  
    }

    return ! not_colliding;
  }
  initializeArea(){
    this.area = {
      width:0.5,
      height:0.5,
    };
    this.selectedKit = {
      id: undefined,
      name: "",
      description: "",
      price: 0,
      kit_description:"",
      grid_rows:0,
      grid_columns:0,
      electric_power: 0,
      electrical_installation: "",
      electrical_assembly: false,
      electrical_assembly_type: "",
      heat_production: false,
      exchanger_number: false,
      domestic_water_heating: false,
      domestic_water_heating_way: false,
      thermal_storage: false,
      smart_r: false,
      components: [],
      product_image: "",
      _panels_data:[],
    };
    this.innerAreas = [];
    this.panelsNumber = [];
    this.windowsChimneies = [];
    this.cornersSize = {
      topLeft: {
        width:this.scall/2,
        height:this.scall/2
      },
      topRight: {
        width: this.scall/2,
        height: this.scall/2
      },
      bottomRight: {
        width: this.scall/2,
        height: this.scall/2
      },
      bottomLeft: {
        width: this.scall/2,
        height: this.scall/2
      },
    }
    this.cornersAction = {
      topLeft: false,
      topRight: false,
      bottomRight: false,
    bottomLeft: false,
    };
    this.panelSize = {
      width: 1,
      height: 1.6
    }
    this.currentAreaIndex = 0;
    $('.grid-choice').addClass('grid-choice-disabled');
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
    $('.grid-choice').removeClass('grid-choice-disabled');
    this.area = this.areas.find(ars=> ars.title == area.getAttribute('data-title'));
    this.panelsNumber = new Array(Math.floor(this.area.width/this.panelSize.width) * Math.floor(this.area.height/this.panelSize.height));    
    this.blocksList = [];
    //configurator
    this.currentAreaIndex = this.configurators.findIndex(cf => cf.areaTitle == area.getAttribute('data-title'));    
    console.log(this.configurators);
    
    console.log( this.currentAreaIndex, this.configurators.find(cf => cf.areaTitle == area.getAttribute('data-title')), area.getAttribute('data-title'));
    
    if(this.configurators[this.currentAreaIndex].kit.selected['_panels_data']) this.selectedKit = this.configurators[this.currentAreaIndex].kit.selected;
    else this.selectedKit = {
      id: undefined,
      name: "",
      description: "",
      price: 0,
      kit_description:"",
      grid_rows:0,
      grid_columns:0,
      electric_power: 0,
      electrical_installation: "",
      electrical_assembly: false,
      electrical_assembly_type: "",
      heat_production: false,
      exchanger_number: false,
      domestic_water_heating: false,
      domestic_water_heating_way: false,
      thermal_storage: false,
      smart_r: false,
      components: [],
      product_image: "",
      _panels_data:[]
    };
    $('label.grid-choice').removeClass("active");
    $('label[data-choice='+this.configurators[this.currentAreaIndex].gridChoice+']').addClass("active");    
    this.changeGridChoice(this.configurators[this.currentAreaIndex].gridChoice, false)
    // innerArea
    this.innerAreas = this.areasData.find(ad => ad.areaTitle == area.getAttribute('data-title')).innerAreas;
    $('.inner-area').remove();
    for (let i = 0; i < this.innerAreas .length; i++) {
      var innerA = this.createInnerArea(this.areaBlock.nativeElement);
      innerA.attr('data-i', i);
      innerA.css(  this.innerAreas[i].style);
      innerA.find('.width').html((innerA.width()/this.scall).toFixed(1)+' m');
      innerA.find('.height').html((innerA.height()/this.scall).toFixed(1)+' m');
      this.blocksList.push(innerA);
    }
    //windowChimney
    this.windowsChimneies = this.areasData.find(ad => ad.areaTitle == area.getAttribute('data-title')).windowChimneys;
    setTimeout(()=>{
      for (let i = 0; i < this.windowsChimneies.length; i++) {
        document.getElementById('window_chimney'+i).style.transform = this.windowsChimneies[i].transform;
        document.getElementById('window_chimney'+i).style.webkitTransform = this.windowsChimneies[i].webkitTransform;
        this.blocksList.push(document.getElementById('window_chimney'+i));
      }
    }, 300)
    //corners
    this.cornersAction = this.areasData.find(ad => ad.areaTitle == area.getAttribute('data-title')).corners.actions;
    this.cornersSize = this.areasData.find(ad => ad.areaTitle == area.getAttribute('data-title')).corners.size;   
    
    $('#add_area').addClass('is-disabled').removeClass('add-area');
    $('#loader_container').removeClass('d-none');
    setTimeout(()=>{
      this.blocksList.push(document.getElementById('top_left'));
      this.blocksList.push(document.getElementById('bottom_left'));
      this.blocksList.push(document.getElementById('top_right'));
      this.blocksList.push(document.getElementById('bottom_right'));
      this.is_colliding(document.getElementsByClassName('grid-line'), this.blocksList);
      this.placeKitsPanel(document.getElementsByClassName('grid-line'));
      $('#loader_container').addClass('d-none');
    }, 300);
  }
  
  goBack(){
    this.router.navigateByUrl("create/project/needs"); 
  }

  save(){    
    sessionStorage.setItem('configurators', JSON.stringify(this.configurators));
    this.router.navigateByUrl("create/project/components"); 
  }
  update() {
    if(this.isProjectEditing){
      sessionStorage.setItem('configurators', JSON.stringify(this.configurators));
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
