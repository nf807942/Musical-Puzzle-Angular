import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
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
      })
    );
  }

}