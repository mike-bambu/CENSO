import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  url = `${environment.base_url}/calidad-web`;

  constructor(private http : HttpClient) { }

  getQuestionJson(){
    return this.http.get<any>("assets/partos.json");
  }

  getCalidadList(payload):Observable<any> {
    return this.http.get<any>(this.url,{params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

}
