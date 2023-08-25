import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { User } from 'src/app/auth/models/user';
import { Clues } from 'src/app/auth/models/clues';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { App } from 'src/app/apps-list/apps';
import { AppsListService } from 'src/app/apps-list/apps-list.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SharedService } from '../../shared/shared.service';
import { Servicios } from 'src/app/auth/models/servicios';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Output() onSidenavToggle = new EventEmitter<void>();

  public isAuthenticated:boolean;
  authSubscription: Subscription;
  selectedApp: any;
  user: User;
  clues: Clues;
  servicios : Servicios;
  apps: App[];
  breakpoint = 6;

  constructor(private authService:AuthService, private appsService: AppsListService, private sharedService: SharedService, private router: Router) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd)  
    ).subscribe((event: NavigationEnd) => {

      this.getApps();
      const routes = event.url.split('/',2);
      const selected_route = routes[1];

      const currentApp = this.sharedService.getCurrentApp();
      if(currentApp.name != selected_route ){
        this.sharedService.newCurrentApp(selected_route);
      }

      if(selected_route){
        this.selectedApp = this.apps.find(function(element) {
          return element.route == selected_route;
        });
      }else{
        this.selectedApp = undefined;
      }
    });
  }

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuth();
    if(this.isAuthenticated){
      this.user = this.authService.getUserData();
      this.clues = this.authService.getCluesData();
      this.servicios = this.authService.getServiciosData();
    }
    this.authSubscription = this.authService.authChange.subscribe(
      status => {
        this.isAuthenticated = status;
        if(status){
          this.user = this.authService.getUserData();
          this.clues = this.authService.getCluesData();
          this.servicios = this.authService.getServiciosData();
        }else{
          this.user = new User();
          this.clues = new Clues();
          this.servicios = new Servicios();
        }
      }
    );
    this.breakpoint = (window.innerWidth <= 599) ? 3 : 6;
  }

  getApps():void{
    this.apps = this.appsService.getApps();
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 599) ? 3 : 6;
  }

  ngOnDestroy(){
    this.authSubscription.unsubscribe();
  }

  toggleSidenav(){
    this.onSidenavToggle.emit();
  }

  logout(){
    this.authService.logout();
  }
}
