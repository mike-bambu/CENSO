import { Component, OnInit } from '@angular/core';
import { App } from '../apps-list/apps';
import { AppsListService } from '../apps-list/apps-list.service';
import { Calidad } from './calidad';


@Component({
  selector: 'app-calidad',
  templateUrl: './calidad.component.html',
  styleUrls: ['./calidad.component.css']
})
export class CalidadComponent implements OnInit {


  apps: Calidad[];
  breakpoint = 6;
  
  constructor(private appsService: AppsListService) { }
  
  ngOnInit(): void {
    this.getApps();
    this.breakpoint = (window.innerWidth <= 599) ? 3 : 6;
  }

  getApps():void{
    this.apps = this.appsService.getCalidadApps();
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 599) ? 3 : 6;
  }

}
