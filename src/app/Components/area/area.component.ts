import { Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import * as interact from 'interactjs/dist/interact.js';

import { Router } from '@angular/router';
import { Area } from 'src/app/Models/Area';
import { ProjectApiService } from 'src/app/Services/project-api.service';

declare var $:JQueryStatic;

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit, AfterViewInit {
  @ViewChild('areaBlock') areaBlock: ElementRef
  constructor(private router:Router, private projectApiService: ProjectApiService) {}
  area:Area = {
    title: "",
    coating:"",
    orientation:"",
    width:0.5,
    height:0.5,
  };
  areas:Area[] = [];
  areasData:any[] = [];
  scall:number = 70;
  types = {window: 'F', chimney: 'C'}
  windowsChimneies = [];
  innerAreas = [];
  blockCords = {
      left: 0,
      top: 0
  };
  blockSize = {
    width: 0,
    height: 0
  }
  cornersAction = {
    topLeft: false,
    topRight: false,
    bottomRight: false,
    bottomLeft: false,
  }
  style: Object = {}
  innerArea = null;
  deleteInnerArea = null;
  rect:any;
  cornersSize = {
    topLeft: {
      width:35,
      height:35
    },
    topRight: {
      width: 35,
      height: 35
    },
    bottomRight: {
      width: 35,
      height: 35
    },
    bottomLeft: {
      width: 35,
      height: 35
    },
  }
  isDrowed: boolean = false;
  direction:string;
  iaTopush = {style: null, deleteIa: null}
  isEditing = null;
  areaIndex:number;
  errorForm:string;
  needs:any;
  conf:any;
  composant:any;
  isProjectEditing:boolean = false;
  ngOnInit(): void {
    
  }
  
  ngAfterViewInit() {
    if(!sessionStorage.getItem("projet")){
      this.router.navigateByUrl("/create/project/info"); 
    }

    this.resize('.area-resize', this.scall,{ left: false, right: true, bottom: true, top: false }, this.area);
    this.resize('.top-left', this.scall,{ left: false, right: true, bottom: true, top: false },null,this.cornersSize);
    this.resize('.top-right', this.scall,{ left: true, right: false, bottom: true, top: false },null,this.cornersSize);
    this.resize('.bottom-left', this.scall,{ left: false, right: true, bottom: false, top: true },null,this.cornersSize);
    this.resize('.bottom-right', this.scall,{ left: true, right: false, bottom: false, top: true },null,this.cornersSize);
    if(sessionStorage.getItem('areas')){
      this.areas = JSON.parse(sessionStorage.getItem('areas'));
    }
    if(sessionStorage.getItem('areasData')){
      this.areasData = JSON.parse(sessionStorage.getItem('areasData'));
    }
    if(sessionStorage.getItem('isUpdate') && sessionStorage.getItem('isUpdate') === "true") this.isProjectEditing = true;
  }
  onTitleChange(e){
    
    if(this.isEditing){
      this.areasData[this.areaIndex].areaTitle = e.target.value;
      this.isEditing = e.target.value;
      if(this.needs && this.needs[this.areaIndex]){
        this.needs[this.areaIndex].areaTitle =  e.target.value;
        sessionStorage.setItem('needs',JSON.stringify(this.needs));
      }
      if(this.conf && this.conf[this.areaIndex+1]){
        this.conf[this.areaIndex+1].areaTitle =  e.target.value;
        sessionStorage.setItem('configurators',JSON.stringify(this.conf));
      }
      if(this.composant && this.composant[this.areaIndex]){
       this.composant[this.areaIndex].areaTitle =  e.target.value;
       sessionStorage.setItem('composants',JSON.stringify(this.composant));
      }
    }
    
  }
  setDirection(orientation){
    let orientations = {
      Nord: 'north',
      Sud: 'south',
      Ouest: 'west',
      Est: 'east'
    }
    
    this.direction = orientations[orientation.value];
  }
  addwindowChimney(){    
    let newWindowChimneyIndex = this.windowsChimneies.push({ 
      width: 0,
      height: 0,
      type : ''
    }) - 1;

    setTimeout(()=>{
      var windowChimney = document.getElementById('window_chimney'+newWindowChimneyIndex);   
      console.log(windowChimney);
       
      this.drag(windowChimney, this.windowsChimneies[newWindowChimneyIndex]);
    }, 1000)
  }

  deleteWindowsFireplace(windowChimney){
    this.windowsChimneies.splice(this.windowsChimneies.indexOf(windowChimney), 1);
  }

  createInnerArea(area, innerArea = null, deleteInnerArea = null, isNew = true){
    innerArea = $(document.createElement('div')).addClass('border border-info inner-area');
    if(isNew) innerArea.attr('data-i', this.innerAreas.length);
    deleteInnerArea = $(document.createElement('i')).addClass('fa fa-times-circle delete-inner-area');
    console.log(deleteInnerArea);
    
    deleteInnerArea.click(function(e){
      e.stopPropagation();
      $(area).off('mouseup');
      deleteInnerArea.parent().remove();
      this.innerAreas.splice(innerArea.attr('data-i'), 1)
    }.bind(this));
    innerArea.append(deleteInnerArea);
    innerArea.mousedown(function(e) {
      e.stopPropagation();
      this.isDrowed = false;
      $(area).off('mousemove');
    }.bind(this));
    
    $(area).append(innerArea);
    innerArea.append("<div class='resizer corner-bottom-right'></div>");
    innerArea.append('<div class="size-info" style="font-size: 7px;height: 100%;">'+
      '<p class="m-0 top-center">'+
        '<span class="width"></span></p>'+
      '<p class="m-0 left-center">'+
        '<span class="height"></span></p></div>');
    
    return {iArea: innerArea, dInnerArea: deleteInnerArea }
  }
  mouseLeave(area){
    $(area).off('mousedown');
    $(area).off('mouseup');
  }
  mouseEnter(area){
      $(area).mousedown(function(e){
        this.rect = e.target.getBoundingClientRect();  
        if(area.style.cursor != 'ew-resize' && area.style.cursor != 'ns-resize' && area.style.cursor != 'nwse-resize' && !this.innerArea){
          this.isDrowed = false;
          this.blockCords.left = (e.clientX - this.rect.left);
          this.blockCords.top = e.clientY - this.rect.top;  
          area.style.cursor = "crosshair";
          let {iArea, dInnerArea} = this.createInnerArea(area);
          this.innerArea  = iArea;
          $(area).mousemove(function(e){
            if(this.rect){
              this.isDrowed = true;
              area.style.cursor = "crosshair";
              this.blockSize.width = Math.abs((e.clientX - this.rect.left) - this.blockCords.left);
              this.blockSize.height = Math.abs((e.clientY - this.rect.top) - this.blockCords.top);
              let left = (((e.clientX - this.rect.left) - this.blockCords.left) < 0 )? (e.clientX - this.rect.left) : this.blockCords.left;
              let top = (((e.clientY - this.rect.top) - this.blockCords.top) < 0 )? (e.clientY - this.rect.top) : this.blockCords.top;
              this.style = {
                left: `${left}px`,
                top: `${top}px`,
                width: `${this.blockSize.width}px`,
                height: `${this.blockSize.height}px`,
              };
              this.iaTopush.style = this.style;
              this.innerArea.css(this.style);
              this.innerArea.find('.width').html((this.blockSize.width/this.scall).toFixed(1)+' m');
              this.innerArea.find('.height').html((this.blockSize.height/this.scall).toFixed(1)+' m');
          }
        }.bind(this));
      }
    }.bind(this));
    
    $(area).mouseup(function(e){
      $(area).off('mousemove');
      e.stopPropagation();        
      if(!this.isDrowed){          
        $(this.innerArea).remove();
      }else {
        this.innerAreas.push(this.iaTopush);
        this.resize('.inner-area', this.scall, { left: false, right: true, bottom: true, top: false }, null, null, true, this.innerAreas);
        this.drag(this.innerArea[0], null, this.innerAreas[this.innerAreas.length-1].style);
      }
        this.iaTopush = {style: null, deleteIa: null}
        this.innerArea = null;
        this.deleteInnerArea = null;
        this.rect = null;
        area.style.cursor = "default";
        this.isDrowed = false;
      }.bind(this));

  }

  addcorner(corner) {
   switch (corner) {
     case 'top-left':;
       if(this.cornersAction.topLeft)
       {
         this.cornersAction.topLeft = false;
         $('#top_left_text').removeClass('fa-times-circle').addClass('fa-plus-circle')
         this.cornersSize.topLeft.width = 35;
         this.cornersSize.topLeft.height = 35;
       }else {
         this.cornersAction.topLeft = true;
         $('#top_left_text').removeClass('fa-plus-circle').addClass('fa-times-circle')
       }
       break;
     case 'top-right':
      if(this.cornersAction.topRight)
      {
        this.cornersAction.topRight = false;
        $('#top_right_text').removeClass('fa-times-circle').addClass('fa-plus-circle')
        this.cornersSize.topRight.width = 35;
        this.cornersSize.topRight.height = 35;
      }else {
        this.cornersAction.topRight = true;
        $('#top_right_text').removeClass('fa-plus-circle').addClass('fa-times-circle')
      }
      break;
     case 'bottom-right':
      if(this.cornersAction.bottomRight)
      {
        this.cornersAction.bottomRight = false;
        $('#bottom_right_text').removeClass('fa-times-circle').addClass('fa-plus-circle')
        this.cornersSize.bottomRight.width = 35;
        this.cornersSize.bottomRight.height = 35;
        $('#corner_area_bottom_right').show();
      }else {
        this.cornersAction.bottomRight = true;
        $('#bottom_right_text').removeClass('fa-plus-circle').addClass('fa-times-circle')
        $('#corner_area_bottom_right').hide();
      }
      break;
     case 'bottom-left':
      if(this.cornersAction.bottomLeft)
      {
        this.cornersAction.bottomLeft = false;
        $('#bottom_left_text').removeClass('fa-times-circle').addClass('fa-plus-circle')
        this.cornersSize.bottomLeft.width = 35;
         this.cornersSize.bottomLeft.height = 35;
      }else {
        this.cornersAction.bottomLeft = true;
        $('#bottom_left_text').removeClass('fa-plus-circle').addClass('fa-times-circle')
      }
       break;
     default:
       break;
   }
  }


  resize(div, scall: number, edg, areasize = null, cornersSize = null, isInnerArea = false, innerArea = null) {
 
    interact(div)
      .resizable({
        // resize from all edges and corners
        edges: edg,
        
        listeners: {
          move (event) {
            // $("#area").off('mouseenter');
            var target = event.target
            var x = (parseFloat(target.getAttribute('data-x')) || 0)
            var y = (parseFloat(target.getAttribute('data-y')) || 0)
            
            // update the element's style
            target.style.width = event.rect.width + 'px'
            target.style.height = event.rect.height + 'px'
            if(areasize){
              areasize.height = (event.rect.height/scall).toFixed(1);
              areasize.width = (event.rect.width/scall).toFixed(1);
            }
            if(cornersSize){
              console.log('fff');
              
              switch (div) {
                case '.top-left':
                  cornersSize.topLeft.width = event.rect.width;
                  cornersSize.topLeft.height = event.rect.height;
                  break;
                case '.top-right':
                  cornersSize.topRight.width = event.rect.width;
                  cornersSize.topRight.height = event.rect.height;                  
                  break;
                case '.bottom-right':
                  cornersSize.bottomRight.width = event.rect.width;
                  cornersSize.bottomRight.height = event.rect.height;
                  break;
                case '.bottom-left':
                  cornersSize.bottomLeft.width = event.rect.width;
                  cornersSize.bottomLeft.height = event.rect.height;
                  break;
                
                default:
                  break;
              }
            }
            
            if(isInnerArea){
              $(target).find('.width').html((event.rect.width/scall).toFixed(1)+' m');
              $(target).find('.height').html((event.rect.height/scall).toFixed(1)+' m');
       
              innerArea[target.getAttribute('data-i')].style['width'] = target.style.width;
              innerArea[target.getAttribute('data-i')].style['height'] = target.style.height;
            
            }

            // translate when resizing from top or left edges
            x += event.deltaRect.left
            y += event.deltaRect.top

            // target.style.webkitTransform = target.style.transform =
            //   'translate(' + x + 'px,' + y + 'px)'
            

            target.setAttribute('data-x', x)
            target.setAttribute('data-y', y)
            // target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height)
          }
        },
        modifiers: [
          // minimum size
          interact.modifiers.restrictSize({
            min: { width: 10, height: 10 }
          })
        ],

        inertia: true
      });
    }

    drag(element, wincimn = null, innerArea = null){
      var x = 0; var y =  0;
      interact(element)
      .draggable({
            modifiers: [
              interact.modifiers.snap({
                targets: [
                  interact.createSnapGrid({ x: 5, y: 5 })
                ],
                range: Infinity,
                relativePoints: [ { x: 0, y: 0 } ]
              }),
              interact.modifiers.restrict({
                restriction: element.parentNode,
                elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
                endOnly: true
              })
            ],
            inertia: true
          })
          .on('dragmove', function (event) {
            // $("#area").off('mouseenter');
            x += event.dx
            y += event.dy
            event.target.style.webkitTransform =
            event.target.style.transform =
                'translate(' + x + 'px, ' + y + 'px)';

            if(wincimn){
              wincimn['transform'] = 'translate(' + x + 'px, ' + y + 'px)';
              wincimn['webkitTransform'] = 'translate(' + x + 'px, ' + y + 'px)';
            }
            
            if(innerArea){
              
              innerArea['transform'] = 'translate(' + x + 'px, ' + y + 'px)';
              innerArea['webkitTransform'] = 'translate(' + x + 'px, ' + y + 'px)';
              
            }
          })
          .on('drop', function(){
            console.log('drop finished');
            
          })
    }
    initializeArea(){
      this.area = {
        title: "",
        coating:"",
        orientation:"",
        width:0.5,
        height:0.5,
      }
      this.windowsChimneies = [];
      this.innerAreas = [];      
      $('.inner-area').remove();
      this.cornersAction = {
        topLeft: false,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
      };
      this.cornersSize = {
        topLeft: {
          width:35,
          height:35
        },
        topRight: {
          width: 35,
          height: 35
        },
        bottomRight: {
          width: 35,
          height: 35
        },
        bottomLeft: {
          width: 35,
          height: 35
        },
      };
      this.resize('.area-resize', this.scall,{ left: false, right: true, bottom: true, top: false }, this.area);
      this.resize('.top-left', this.scall,{ left: false, right: true, bottom: true, top: false },null,this.cornersSize);
      this.resize('.top-right', this.scall,{ left: true, right: false, bottom: true, top: false },null,this.cornersSize);
      this.resize('.bottom-left', this.scall,{ left: false, right: true, bottom: false, top: true },null,this.cornersSize);
      this.resize('.bottom-right', this.scall,{ left: true, right: false, bottom: false, top: true },null,this.cornersSize);
      $('#bottom_right_text').removeClass('fa-times-circle').addClass('fa-plus-circle')
      $('#bottom_left_text').removeClass('fa-times-circle').addClass('fa-plus-circle')
      $('#top_left_text').removeClass('fa-times-circle').addClass('fa-plus-circle')
      $('#top_right_text').removeClass('fa-times-circle').addClass('fa-plus-circle')
      $('#corner_area_bottom_right').show();
    }

    addArea(areaForm) {
      if(areaForm.valid){
        this.errorForm = null;
        if(!this.isEditing){
          if(!this.areas.find(ars => ars.title == this.area.title)){
            this.areas.push(this.area);          
            this.areasData.push({
              areaTitle: this.area.title,
              windowChimneys: this.windowsChimneies,
              innerAreas:  this.innerAreas,
              corners: {
                size: this.cornersSize,
                actions: this.cornersAction
              }
            });  
            this.initializeArea();
          }else this.errorForm = "une surfase intitulé '"+this.area.title+"' est déja exite !"       
        }
      }else this.errorForm = "La formulair du surface de pose n'est pas valide !"
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
      area.style['box-shadow'] = "none";
      area.style['color'] = "white";
      area.classList.add('bg-primary')
      if(sessionStorage.getItem('needs')){
        this.needs = JSON.parse(sessionStorage.getItem('needs'));
      }
      if(sessionStorage.getItem('configurators')){
        this.conf = JSON.parse(sessionStorage.getItem('configurators'));
      }
      if(sessionStorage.getItem('composants')){
       this.composant = JSON.parse(sessionStorage.getItem('composants'));
      }
      this.area = this.areas.find(ars=> ars.title == area.getAttribute('data-title'));
      this.areaIndex = this.areas.findIndex(ars=> ars.title == area.getAttribute('data-title'));
      console.log(this.areaIndex);
      console.log(this.areasData, this.areasData[this.areaIndex]);
      
      this.resize('.area-resize', this.scall,{ left: false, right: true, bottom: true, top: false }, this.area);
      let orientations = {
        Nord: 'north',
        Sud: 'south',
        Ouest: 'west',
        Est: 'east'
      }
      
      this.direction = orientations[this.area.orientation];
      //innerArea      
      this.innerAreas = this.areasData.find(ad => ad.areaTitle == this.area.title).innerAreas;
      $('.inner-area').remove();
      for (let i = 0; i < this.innerAreas .length; i++) {
        var innerA = this.createInnerArea(this.areaBlock.nativeElement, null, null, false).iArea;
        innerA.attr('data-i', i);
        innerA.css(  this.innerAreas[i].style);
        console.log(  this.innerAreas[i]);
        this.resize('.inner-area', this.scall, { left: false, right: true, bottom: true, top: false }, null, null, true, this.innerAreas);
        this.drag(innerA[0], null,   this.innerAreas[i].style);
        innerA.find('.width').html((innerA.width()/this.scall).toFixed(1)+' m');
        innerA.find('.height').html((innerA.height()/this.scall).toFixed(1)+' m');
      }
      //windowChimney
      this.windowsChimneies = this.areasData.find(ad => ad.areaTitle == this.area.title).windowChimneys;
      setTimeout(()=>{
        for (let i = 0; i < this.windowsChimneies.length; i++) {
          document.getElementById('window_chimney'+i).style.transform = this.windowsChimneies[i].transform
          document.getElementById('window_chimney'+i).style.webkitTransform = this.windowsChimneies[i].webkitTransform
          this.drag(document.getElementById('window_chimney'+i), this.windowsChimneies[i]);
        }
      }, 300)
      //corners
      this.cornersAction = this.areasData.find(ad => ad.areaTitle == this.area.title).corners.actions;
      this.cornersSize = this.areasData.find(ad => ad.areaTitle == this.area.title).corners.size;   
      this.resize('.top-left', this.scall,{ left: false, right: true, bottom: true, top: false },null, this.areasData.find(ad => ad.areaTitle == this.area.title).corners.size);
      this.resize('.top-right', this.scall,{ left: true, right: false, bottom: true, top: false },null, this.areasData.find(ad => ad.areaTitle == this.area.title).corners.size);
      this.resize('.bottom-left', this.scall,{ left: false, right: true, bottom: false, top: true },null, this.areasData.find(ad => ad.areaTitle == this.area.title).corners.size);
      this.resize('.bottom-right', this.scall,{ left: true, right: false, bottom: false, top: true },null, this.areasData.find(ad => ad.areaTitle == this.area.title).corners.size); 
      this.isEditing = area.getAttribute('data-title');
      $('#add_area').addClass('is-disabled').removeClass('add-area');
    }


    deleteCreatedArea(area){
      this.areas.splice(this.areas.findIndex(as=> as.title == area.getAttribute('data-title')), 1);
      this.areasData.splice(this.areasData.findIndex(asd=> asd.areaTitle == area.getAttribute('data-title')), 1);
    }
    
    dismissAlert() {
      this.errorForm = null;
    }
    save(){      
      if(this.areas.length !== 0){
        sessionStorage.setItem('areas', JSON.stringify(this.areas));
        sessionStorage.setItem('areasData', JSON.stringify(this.areasData));
        this.router.navigateByUrl("create/project/needs"); 
      }else {
        this.errorForm = "Vous devez créer ou moins une surface !"
      }
    }
    update() {
      if(this.isProjectEditing){
        sessionStorage.setItem('areas', JSON.stringify(this.areas));
        sessionStorage.setItem('areasData', JSON.stringify(this.areasData));
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
    
    goBack(){      
      this.router.navigateByUrl("create/project/info"); 
    }
}

