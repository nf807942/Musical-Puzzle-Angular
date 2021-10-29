import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-message-snackbar',
  templateUrl: './message-snackbar.component.html',
  styleUrls: ['./message-snackbar.component.scss']
})
export class MessageSnackbarComponent implements OnInit {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any) {
  }

  ngOnInit(): void {
  }

}
