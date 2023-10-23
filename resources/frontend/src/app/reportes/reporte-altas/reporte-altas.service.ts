import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReporteAltasService {
  url_monitoreo         = `${environment.base_url}/reporte-altas`;
  // url_filter_catalogs   = `${environment.base_url}/catalogos-monitoreo`;
  url_catalogs          = `${environment.base_url}/obtener-catalogos`;

  constructor(private http: HttpClient) { }


  getMonitoreo(payload): Observable<any> {
    return this.http.get<any>(this.url_monitoreo,{params: payload}).pipe(
      map(response => {
        return response;

      })
    );
  }


  // getFilterCatalogs(): Observable<any> {
  //   return this.http.get<any>(this.url_filter_catalogs).pipe(
  //     map(response => {
  //       console.log("valor", response);
  //       return response;
  //     })
  //   );
  // }

  obtenerCatalogos(payload) {
    return this.http.post<any>(this.url_catalogs,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }



}

