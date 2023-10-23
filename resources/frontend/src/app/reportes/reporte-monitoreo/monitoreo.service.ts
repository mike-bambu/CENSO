import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MonitoreoService {
  
  url_pacientes_hospitalizados         = `${environment.base_url}/reporte-pacientes-hospitalizados`;
  url_catalogos                        = `${environment.base_url}/catalogos`;

  constructor(private http: HttpClient) { }


  getPacientesHospitalizados(payload): Observable<any> {
    return this.http.post<any>(this.url_pacientes_hospitalizados,payload).pipe(
      map(response => {
        return response;

      })
    );
  }

  obtenerCatalogos(payload) {
    return this.http.post<any>(this.url_catalogos,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

}

