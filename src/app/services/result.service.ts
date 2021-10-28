import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Result } from '../models/result';


@Injectable({
  providedIn: 'root'
})
export class ResultService {

  constructor(
    private http: HttpClient
  ) { }

  get_results(): Observable<Result[]> {
    return this.http.get(`${environment.url}/read_results.php`).pipe(
      map((res: any) => {
        return res['data'].splice(1).map(row => this.data_to_result(row));
      })
    );
  }

  save_result(data: Result): any {
    return this.http.post(`${environment.url}/save_result.php`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  download_link(): string {
    return `${environment.url}/download_results.php`;
  }

  data_to_result(data: any): Result {
    return {
      form: {
        email: data[0],
        age: data[1],
        status: data[2],
        experience: data[3],
        learning: data[4],
        instruments: data[5],
        practice: data[6]
      },
      difficulty: {
        nb_pieces: data[7],
        nb_instruments: data[8],
        available_solution: data[9],
        pieces_slider: data[10],
      },
      result: {
          date: data[11],
          audio: data[12],
          score: data[13],
          time: data[14],
          order_init: data[15],
          order_response: data[16],
      }
    }
  }
}
