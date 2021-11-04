import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageSnackbarComponent } from '../commons/snackbars/message-snackbar/message-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    private snackBar: MatSnackBar
  ) { }

  open(duration: number, icon: string, message: string, color: string): void {
    this.snackBar.openFromComponent(MessageSnackbarComponent, {
      duration: duration * 1000,
      panelClass: [color],
      data: {
        icon: icon,
        message: message,
        color: color
      }
    });
  }

  success(duration: number, message: string): void {
    this.open(duration, 'check', message, 'success-snackbar');
  }
  
  error(duration: number, message: string): void {
    this.open(duration, 'error_outline', message, 'error-snackbar');
  }
}
