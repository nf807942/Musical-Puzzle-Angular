import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SaveResultService {

  constructor(
    private http: HttpClient
  ) { }

  get(url: string): any {
    return this.http.get(`${environment.url}/${url}.php`).pipe(
      map((res: any) => {
        return res['data'];
      })
    );
  }

  post(url: string, data: any): any {
    return this.http.post(`${environment.url}/${url}.php`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
