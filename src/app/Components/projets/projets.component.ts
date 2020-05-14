import { Component, OnInit } from '@angular/core';
import { AuthApiService } from 'src/app/Services/auth-api.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-projets',
  templateUrl: './projets.component.html',
  styleUrls: ['./projets.component.scss']
})
export class ProjetsComponent implements OnInit {

  constructor(private _auth: AuthApiService,
              private _router: Router) { }

  ngOnInit(): void {
  
  }
}

