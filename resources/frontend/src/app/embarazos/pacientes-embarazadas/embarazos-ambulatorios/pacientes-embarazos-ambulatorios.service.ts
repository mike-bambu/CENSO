import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmbarazosAmbulatoriosService {
  
  url_pacientes_embarazadas       = `${environment.base_url}/reporte-embarazos-ambulatorios`;
  url_catalogos                   = `${environment.base_url}/catalogos`;

  constructor(private http: HttpClient) { }


  getEmbarazosAmbulatorios(payload): Observable<any> {
    return this.http.post<any>(this.url_pacientes_embarazadas, payload).pipe(
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

