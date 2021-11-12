import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-track-dialog',
  templateUrl: './track-dialog.component.html',
  styleUrls: ['./track-dialog.component.scss']
})
export class TrackDialogComponent implements OnInit {

  form: FormGroup;
  hide: boolean = true;
  list: File[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TrackDialogComponent>,
  ) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      name: this.fb.control('', {validators:[Validators.required]}),
    })
  }

  selectFiles(event: any): void {
    this.list = Array.from(event.target.files);
  }

  removeFile(file: File): void {
    const index = this.list.indexOf(file, 0);
    if (index > -1) {
      this.list.splice(index, 1);
    }
  }

  close() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.number);
    }
  }

}
