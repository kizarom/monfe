import { Component, OnInit, AfterViewInit, DoCheck, AfterContentInit } from '@angular/core';

@Component({
  selector: 'app-navs',
  templateUrl: './navs.component.html',
  styleUrls: ['./navs.component.scss']
})
export class NavsComponent implements OnInit, AfterViewInit, DoCheck {
  pi=true;
ai:Boolean;
bi=true;
ci:Boolean;
Ai=true;
ri:boolean;
projet:any = JSON.parse(sessionStorage.getItem("projet"));
area:any = JSON.parse(sessionStorage.getItem("areas"));
besoin:any = {};
configurateur:any =  JSON.parse(sessionStorage.getItem("configurators"));
areas:any = {};
s=0;
detail=""
constructor() { }

ngOnInit(): void {
  

}

ngAfterViewInit(): void {


}

  ngDoCheck(){
    this.projet = JSON.parse(sessionStorage.getItem("projet"));
    this.area = JSON.parse(sessionStorage.getItem("areas"));
    
    this.besoin = JSON.parse(sessionStorage.getItem("needs"));
    this.configurateur = JSON.parse(sessionStorage.getItem("configurators"));
    this.areas = JSON.parse(sessionStorage.getItem("composant"));   
    if(this.s === 0){
      if(JSON.parse(sessionStorage.getItem("configurators"))){
        this.configurateur = JSON.parse(sessionStorage.getItem("configurators"));
        this.configurateur[1].kit.selected._panels_data.forEach(panel => {
          this.s=+this.s+ +panel.number
          this.detail=this.detail+" "+panel.number+"("+panel.type+")";
        });
      }
    }
    if(JSON.parse(sessionStorage.getItem("projet"))){
      this.pi=false;
     }
    if(JSON.parse(sessionStorage.getItem("areas"))){
      this.pi=false;
      this.ai=true;
     }
     if(JSON.parse(sessionStorage.getItem("needs"))){
      this.pi=false;
      this.ai=true;
      this.bi=false;
     }
     if(JSON.parse(sessionStorage.getItem("configurators"))){
      this.pi=false;
      this.ai=true;
      this.bi=false;
      this.ci=true;
     }
     if(JSON.parse(sessionStorage.getItem("composants"))){
      this.pi=false;
      this.ai=true;
      this.bi=false;
      this.ci=true;
      this.Ai=false;
      this.ri=true;
     }
     
  }

}
