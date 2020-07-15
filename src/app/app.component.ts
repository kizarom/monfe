import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MonDevis';
  constructor(private _router: Router){
  }
  hasRoute(route: string) {
    return this._router.url.includes(route);
  }
}
