import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-number-dialog',
  templateUrl: './number-dialog.component.html',
  styleUrls: ['./number-dialog.component.scss']
})
export class NumberDialogComponent implements OnInit {

  form: FormGroup;
  hide: boolean = true;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NumberDialogComponent>,
  ) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      number: this.fb.control('', {validators:[Validators.required]}),
    })
  }

  close() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.number);
    }
  }
  
}
