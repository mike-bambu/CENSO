import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CamasService {

  url                                     = `${environment.base_url}/camas`;
  url_obtener_catalogos                   =  `${environment.base_url}/catalogos`;
  url_estatus_camas_total                 = `${environment.base_url}/camas-estatus`;

  constructor(private http: HttpClient) { }

  getCamasList(payload):Observable<any> {
    return this.http.get<any>(this.url,{params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  obtenerCatalogos(payload) {
    return this.http.post<any>(this.url_obtener_catalogos,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }
  

  getAllCamas():Observable<any> {
    return this.http.get<any>(this.url,{}).pipe(
      map( response => {
        return response;
      })
    );
  }

  getCamasTotal(payload):Observable<any> {
    return this.http.post<any>(this.url_estatus_camas_total,payload).pipe(
      map( response => {
        return response;
      })
    );
  }

  getCama(id) {
    return this.http.get<any>(this.url+'/'+id,{}).pipe(
      map( (response: any) => {
        return response;
      }
    ));
  }

  updateCama(id,payload) {
    return this.http.put<any>(this.url+'/'+id,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  createCama(payload) {
    return this.http.post<any>(this.url,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  deleteCama(id) {
    return this.http.delete<any>(this.url+'/'+id,{}).pipe(
      map( (response) => {
        return response;
      }
    ));
  }
}
