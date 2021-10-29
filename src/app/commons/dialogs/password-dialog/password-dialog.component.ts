import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-password-dialog',
  templateUrl: './password-dialog.component.html',
  styleUrls: ['./password-dialog.component.scss']
})
export class PasswordDialogComponent implements OnInit {

  form: FormGroup;
  hide: boolean = true;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PasswordDialogComponent>,
  ) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      password: this.fb.control('', {validators:[Validators.required]}),
    })
  }

  close() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.password);
    }
  }

}
