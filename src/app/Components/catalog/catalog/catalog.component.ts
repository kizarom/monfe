import { Component, OnInit } from '@angular/core';
import { ComponentApiService } from 'src/app/Services/component-api.service';
import { ComponentInterface } from 'src/app/Models/ComponentInterface';
import { AuthApiService } from 'src/app/Services/auth-api.service';

declare var $:JQueryStatic;

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  constructor(private CompoenentApiService: ComponentApiService, private authApiService: AuthApiService) { }
  components:ComponentInterface[];
  componentsBytype:any[];
  componentsType = {
    Recepteursolaire: "Recepteur solaire",
    Integration: "Intégration",
    Quincaillerie: "Quincaillerie",
    Aerolique: "Aérolique",
    Hydraulique: "Hydraulique",
    Electrique: "Électrique"
  }
  component:ComponentInterface;
  componentInCartQuantity:number = 1; 
  cart:any = [];
  isAdmin;
  ngOnInit(): void {
    this.isAdmin = this.authApiService.getConnectedAdmin() || this.authApiService.isSuperAdmin();
    this.getComponents();
    if(sessionStorage.getItem('cart')){
      this.cart = JSON.parse(sessionStorage.getItem('cart'));
    }
  }

  getComponents(){

    this.CompoenentApiService.getAllComponent().subscribe((components: ComponentInterface[])=>{
      this.components = components;
    });
    
    this.CompoenentApiService.getComponentBytype().subscribe((componentsBytype: any[])=>{
      this.componentsBytype = componentsBytype;
      console.log(this.componentsBytype);
      
    });
  }

  showComponentList(e){
  
   if($(e.currentTarget).attr('data-hidden') === 'false'){ 
      $(e.currentTarget).find('.list-component').hide(500);
      $(e.currentTarget).find('.fa-chevron-up').addClass('fa-chevron-down').removeClass('fa-chevron-up');
      $(e.currentTarget).attr('data-hidden', 'true');
   } else{
      $(e.currentTarget).find('.list-component').show(500);
      $(e.currentTarget).attr('data-hidden', 'false');
      $(e.currentTarget).find('.fa-chevron-down').addClass('fa-chevron-up').removeClass('fa-chevron-down');
   }
  }

  showComponen(component){
    this.component = component;
  }

  addQuantity(){
    if(this.componentInCartQuantity !== this.component.quantity)
    this.componentInCartQuantity++;
  }
  
  subtractQuantity(){
    if(this.componentInCartQuantity !== 1) this.componentInCartQuantity--; 
  }

  addToCart(){
    var componentIndex = this.cart.findIndex(cp => cp['component'].id == this.component.id);
    if(componentIndex !== -1) {
      this.cart[componentIndex].quantity = this.componentInCartQuantity; 
    }else {
      this.cart.push({
        component: this.component,
        quantity: this.componentInCartQuantity
      });
    }
    this.componentInCartQuantity = 1;
    sessionStorage.setItem('cart', JSON.stringify(this.cart));
  }

  scrollLeft(event){
    event.preventDefault();
    $('#assoc_component_container').animate({
      scrollLeft: "+=200px"
    }, "slow");
  }

  scrollRight(event){
    event.preventDefault();
    $('#assoc_component_container').animate({
      scrollLeft: "-=200px"
    }, "slow");
  }

  getAssociatedComponent(componentAssoc){
    this.component = componentAssoc;
  }
}
