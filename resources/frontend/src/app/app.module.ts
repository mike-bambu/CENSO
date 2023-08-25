import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule  } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { LocationStrategy, HashLocationStrategy} from '@angular/common';

import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';
import { AppsListModule } from './apps-list/apps-list.module';

import { AppRoutingModule } from './app-routing.module';
import { WildcardRoutingModule } from './wildcard-routing.module';

import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { DrawerListComponent } from './navigation/drawer-list/drawer-list.component';
import { HeaderComponent } from './navigation/header/header.component';
import { WelcomeComponent } from './welcome/welcome.component';

import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';

import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { SharedService } from './shared/shared.service';
import { TokenInterceptor, ErrorInterceptor } from './token.service';
import { NotFoundComponent } from './not-found/not-found.component';

import { SecurityModule } from './security/security.module';
import { ProfileModule } from './profile/profile.module';
import { ForbiddenComponent } from './forbidden/forbidden.component';

import { StoreModule } from '@ngrx/store';

//import { CatalogosModule } from './catalogos/catalogos.module';
import { IngresosModule } from './ingresos/ingresos.module';
import { AtencionPacientesModule } from './atencion-pacientes/atencion-pacientes.module';
import { CamasModule } from './camas/camas.module';
import { ServiciosModule } from './servicios/servicios.module';
import { ReportesModule } from './reportes/reportes.module';

import { VisitaPuerperalModule } from './visita-puerperal/visita-puerperal.module';
import { EmbarazosModule } from './embarazos/embarazos.module';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidenavListComponent,
    WelcomeComponent,
    NotFoundComponent,
    DrawerListComponent,
    ForbiddenComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AuthModule,
    SharedModule,
    AppsListModule,
    UsersModule,
    SecurityModule,
    ProfileModule,
    //CatalogosModule,
    IngresosModule,
    VisitaPuerperalModule,
    AtencionPacientesModule,
    CamasModule,
    ServiciosModule,
    ReportesModule,
    EmbarazosModule,
    AppRoutingModule,
    WildcardRoutingModule,
    StoreModule.forRoot({}, {}),
  ],
  providers: [
    AuthService,
    SharedService,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    },
    {
      provide: MAT_DATE_LOCALE, 
      useValue: 'es-MX'
    },
    { 
      provide: LOCALE_ID, 
      useValue: 'es-MX'
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
