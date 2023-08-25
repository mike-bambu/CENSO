import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VisitaPuerperalService {

  url                                     = `${environment.base_url}/puerperas-embarazadas`;                         
  url_info_paciente_egreso                = `${environment.base_url}/ver-info-paciente-egreso/`;
  url_visita_puerperal                    = `${environment.base_url}/visita-puerperal`;
  // url_alta                                = `${environment.base_url}/alta-web`;
  // url_atencion                            = `${environment.base_url}/atenciones-web`;

  url_filter_catalogs                     =  `${environment.base_url}/catalogos-lista-filtros`;
  url_obtener_catalogos                   =  `${environment.base_url}/catalogos`;
  url_calcular_curp                       =  'http://curpmexico.ddns.net:8082/api/curp';



  constructor(private http: HttpClient) { }

  // getPuerperasEmbarazadasList(payload):Observable<any> {
  //   return this.http.get<any>(this.url,{params: payload}).pipe(
  //     map( response => {
  //       return response;
  //     })
  //   );
  // }

  getPuerperasEmbarazadasList(payload):Observable<any> {
    if(payload.reporte && payload.export_excel){
      return this.http.get<any>(this.url, {params:payload, responseType: 'blob' as 'json'});
    }
    return this.http.get<any>(this.url, {params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  getPuerperasEmbarazadasFilters(filters):Observable<any> {
    return this.http.get<any>(this.url,{params: filters}).pipe(
      map( response => {
        return response;
      })
    );
  }

  getPuerperaEmbarazada(id) {
    return this.http.get<any>(this.url+'/'+id,{}).pipe(
      map( (response: any) => {
        return response;
      }
    ));
  }

  verInfoPacienteEgreso(id:any,payload:any):Observable<any>{
    return this.http.get<any>(this.url_info_paciente_egreso + id, {params:payload}).pipe(
      map( (response: any) => {
        return response;
      })
    );
  }

  getFilterCatalogs():Observable<any>{
    return this.http.get<any>(this.url_filter_catalogs).pipe(
      map(response => {
        return response;
      })
    );
  }

  calcularCurp(payload):Observable<any> {
    return this.http.get<any>(this.url_calcular_curp+payload).pipe(
      map( response => {
        console.log("curp",response);
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

  updatePaciente(id,payload) {
    return this.http.put<any>(this.url+'/'+id,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  createPaciente(payload) {
    return this.http.post<any>(this.url,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  createVisita(payload) {
    return this.http.post<any>(this.url_visita_puerperal,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }
  

  deletePaciente(id) {
    return this.http.delete<any>(this.url+'/'+id,{}).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

}
