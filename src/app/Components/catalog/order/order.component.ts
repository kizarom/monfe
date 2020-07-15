import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ComponentInterface } from "src/app/Models/ComponentInterface";
import { Router } from "@angular/router";
import { ComponentApiService } from "src/app/Services/component-api.service";
import { Order } from "src/app/Models/Order";
import { User } from "src/app/Models/user";
import * as jwt_decode from "jwt-decode";
import { ContactApiService } from "src/app/Services/contact-api.service";
import { OrderComponentInterface } from "src/app/Models/order-component-interface";
import { Contact } from "src/app/Models/contact";
import { OrderApiService } from "src/app/Services/order-api.service";

@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.scss"],
})
export class OrderComponent implements OnInit, AfterViewInit {
  constructor(
    private router: Router,
    private contactservice: ContactApiService,
    private orderService: OrderApiService,
    private componentService: ComponentApiService
  ) {}

  tabTest: any = [];
  cart: any = [];
  sessionData: any[];
  componentsTable: ComponentInterface[] = [];
  infoMessage:string;
  component: ComponentInterface = {
    man_ref: "",
    rexel_ref: "",
    title: "",
    quantity: 1,
    description: "",
    type: "",
    price: 0,
  };
  order: Order = {
    type: "",
    status: "",
    salseQuot: null,
    components: null,
    client: null,
    ligncommands: null,
  };
  commandLignTabl: OrderComponentInterface[] = [];

  username: any;
  currentUser: Contact;
  contacts: Contact[];
  message: string;
  totalPrice = 0;
  totalQute = 0;

  ngOnInit(): void {
    if (sessionStorage.getItem("cart")) {
      this.cart = JSON.parse(sessionStorage.getItem("cart"));
    }
    this.getTotlaPrice();
    this.getTotlaQuantities();

    let token = localStorage.getItem("token");
    var decodedToken = jwt_decode(token);
    this.username = decodedToken["username"];
    this.getCurrentUser();
  }

  ngAfterViewInit() {}

  deletAll() {
    //  var key = sessionStorage.key(0);
    //  sessionStorage.removeItem(key);
    sessionStorage.removeItem("cart");
    this.cart = [];
    this.message = "Votre panier est vide , Merci de le remplire ;)";
    this.totalPrice = 0;
    this.totalQute = 0;
  }

  getTotlaPrice() {
    for (let obj of this.cart) {
      let priceCalcul = obj.component.price * obj.quantity;
      this.totalPrice += priceCalcul;
    }
  }

  getTotlaQuantities() {
    for (let obj of this.cart) {
      let sum = obj.quantity;
      this.totalQute += sum;
    }
  }

  deletComponent($id) {
    var cart = this.cart.findIndex((cr) => cr.component.id === $id);
    this.cart.splice(cart, 1);
    sessionStorage.cart = JSON.stringify(this.cart);
    //update price Total
    this.totalPrice = 0;
    this.getTotlaPrice();
    //update quantites
    this.totalQute = 0;
    this.getTotlaQuantities();
  }

  createOrderCommand() {
    this.order.type = "En catalogue";
    this.order.status = "Nouveau";
    if (sessionStorage.getItem("currentUser")) {
      this.order.client = JSON.parse(sessionStorage.getItem("currentUser"));
    }
    this.order.salseQuot = null;
    this.sessionData = JSON.parse(sessionStorage.getItem("cart"));
    for (var i = 0; i < this.sessionData.length; i++) {
      this.componentsTable[i] = this.sessionData[i].component;
    }
    this.order.components = this.componentsTable;

    for (let obj of this.sessionData) {
      this.commandLignTabl.push({
        component: obj.component,
        price: obj.component.price * obj.quantity,
        quantity:  obj.quantity
      });
    }
    this.order.ligncommands = this.commandLignTabl;
    
    this.orderService.addOrder(this.order).subscribe(
      (resp) => {
        console.log("Bien Inséré");
        this.infoMessage = "La commande est éffectué avec succés.";
        console.log(resp);
      },
      (error) => {
        console.log(error);
      }
    );
    this.cart = [];
    this.message = "Votre panier est vide , Merci de le remplire ;)";
    sessionStorage.removeItem("cart");
    this.totalPrice = 0;
    this.totalQute = 0;

  }

  dismissAlert(){
    this.infoMessage = null;
  }

  getCurrentUser() {
    this.contactservice.getAllContact().subscribe((contactList: Contact[]) => {
      this.contacts = contactList["hydra:member"];
      this.currentUser = this.contacts.find(
        (contact) => contact.email == this.username
      );
      sessionStorage.setItem("currentUser", JSON.stringify(this.currentUser));
    });
  }
}
