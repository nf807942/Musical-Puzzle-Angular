import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  constructor(
    private http: HttpClient
  ) {
    if (localStorage.getItem('authenticated') === null) {
      localStorage.setItem('authenticated', 'false');
    }
  }

  get Authenticated(): boolean {
    return localStorage.getItem('authenticated') === 'true';
  }

  connection(password: string): Observable<boolean> {
    return this.http.post(`${environment.url}/connection.php`, password).pipe(
      map((res: any) => {
        if (res['data'] === true) {
          localStorage.setItem('authenticated', 'true')
        }
        return this.Authenticated;
      })
    );
  }

  disconnection(): void {
    localStorage.setItem('authenticated', 'false');
  }
}
