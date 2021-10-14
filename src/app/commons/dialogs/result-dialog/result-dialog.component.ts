import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export enum ResultDialogOutputData {
  retry,
  quit,
  difficulty
}

export interface ResultDialogInputData {
  success_by_row: number[];
  success_total: number[];
  pieces: number;
  duration: number;
}

@Component({
  selector: 'app-result-dialog',
  templateUrl: './result-dialog.component.html',
  styleUrls: ['./result-dialog.component.scss']
})
export class ResultDialogComponent implements OnInit {

  resultDialogData = ResultDialogOutputData;

  constructor(
    public dialogRef: MatDialogRef<ResultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ResultDialogInputData) {
  }

  ngOnInit(): void {
  }

}
