import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Track } from '../models/track';

@Injectable({
  providedIn: 'root'
})
export class TracksService {

  constructor(
    private http: HttpClient
  ) { }

  delete_track(track: Track): Observable<boolean> {
    return this.http.post(`${environment.url}/delete_track.php`, track).pipe(
      map((res: any) => {
        return res;
      }), catchError(() => of(false))
    );
  }

  add_track(form: any): Observable<boolean> {
    const formData = new FormData();
    for (var i = 0; i < form.list.length; i++) {
      formData.append("file[]", form.list[i]);
    }
    formData.append("name", form.name + '.mp3');

    return this.http.post(`${environment.url}/add_track.php`, formData).pipe(
      map((res: any) => {
        return res;
      }), catchError(() => of(false))
    );
  }
}
