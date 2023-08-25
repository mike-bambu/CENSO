import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngresosService {

  url                                     = `${environment.base_url}/ingresos-web`;                         
  url_info_paciente                       = `${environment.base_url}/ver-info-paciente/`;
  url_seguimientos                        = `${environment.base_url}/seguimientos-web`;
  url_alta                                = `${environment.base_url}/alta-web`;
  url_atencion                            = `${environment.base_url}/atenciones-web`;
  // url_catalogo_diagnostico_autocomplet    = `${environment.base_url}/busqueda-diagnosticos`;
  url_personas_callcenter                 = `http://contingencia.saludchiapas.gob.mx/api/search-personas`;
  url_id_persona_callCenter               = `http://contingencia.saludchiapas.gob.mx/api/search-personas`;

  url_filter_catalogs                     =  `${environment.base_url}/catalogos-lista-filtros`;
  url_obtener_catalogos                   =  `${environment.base_url}/catalogos`;
  url_calcular_curp                       =  'http://curpmexico.ddns.net:8082/api/curp';



  constructor(private http: HttpClient) { }

  getPacientesList(payload):Observable<any> {
    return this.http.get<any>(this.url,{params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  getPacientesFilters(filters):Observable<any> {
    return this.http.get<any>(this.url,{params: filters}).pipe(
      map( response => {
        return response;
      })
    );
  }

  getPaciente(id) {
    return this.http.get<any>(this.url+'/'+id,{}).pipe(
      map( (response: any) => {
        return response;
      }
    ));
  }

  verInfoPaciente(id:any,payload:any):Observable<any>{
    return this.http.get<any>(this.url_info_paciente + id, {params:payload}).pipe(
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


  buscarPacientesCallCenter(payload):Observable<any>{
    return this.http.get<any>(this.url_personas_callcenter,{params:payload}).pipe(
      map( response => {
        return response.data;
      })
    );
  }

  getPacienteCallcenter(id) {
    return this.http.get<any>(this.url_id_persona_callCenter+'/'+id,{}).pipe(
      map( (response: any) => {
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

  createSeguimiento(payload) {
    return this.http.post<any>(this.url_seguimientos,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  createAlta(payload) {
    return this.http.post<any>(this.url_alta,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  createAtencion(payload) {
    return this.http.post<any>(this.url_atencion,payload).pipe(
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
