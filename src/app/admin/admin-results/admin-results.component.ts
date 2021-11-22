import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Result } from 'src/app/models/result';
import { ResultService } from 'src/app/services/result.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-admin-results',
  templateUrl: './admin-results.component.html',
  styleUrls: ['./admin-results.component.scss']
})
export class AdminResultsComponent implements OnInit {

  results: Observable<Result[]>;

  constructor(
    public resultService: ResultService,
    private snackbarService: SnackbarService
    ) { }

  ngOnInit(): void {
    this.snackbarService.loading();
    this.results = this.resultService.get_results().pipe(
      tap(() => this.snackbarService.dismiss()),
      catchError((error) => {
        this.snackbarService.error(3, 'APP.ERROR_LOADING_RESULTS');
        return [];
      })
    );
  }

  displayedColumns: string[] = [
    'email',
    'age',
    'status',
    'experience',
    'learning',
    'instruments',
    'practice',
    'nb_pieces',
    'nb_instruments',
    'available_solution',
    'pieces_slider',
    'date',
    'audio',
    'score',
    'time',
    'order_init',
    'order_response',
  ];

  propertySectionName(property: string): string {
    return this.displayedColumns.indexOf(property) >= 0 && this.displayedColumns.indexOf(property) < 7 ? 'form'
    : this.displayedColumns.indexOf(property) >= 7 && this.displayedColumns.indexOf(property) < 11 ? 'difficulty'
    : this.displayedColumns.indexOf(property) >= 11 && this.displayedColumns.indexOf(property) < 17 ? 'result' : ''
  }

}
