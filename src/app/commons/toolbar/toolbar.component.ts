import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppConfigService } from 'src/app/services/app-config.service';
import { ConnectionService } from 'src/app/services/connection.service';
import { PasswordDialogComponent } from '../dialogs/password-dialog/password-dialog.component';
import { MessageSnackbarComponent } from '../snackbars/message-snackbar/message-snackbar.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  currentLanguage: string;
  languageList: string[];

  constructor(
    private translate: TranslateService,
    private dialog: MatDialog,
    public connectionService: ConnectionService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.currentLanguage = translate.currentLang;
    this.languageList = AppConfigService.settings.language.available_languages;
  }

  ngOnInit() {
  }

  setLanguage(language: string): void {
    this.translate.use(language);
    this.currentLanguage = language;
  }

  openPasswordDialog(): void {
    const dialogRef = this.dialog.open(PasswordDialogComponent, 
      {
        disableClose: true,
        minWidth: '400px'
      });

    dialogRef.afterClosed().subscribe((result) => {
      if(result !== null) {
        this.connectionService.connection(result).subscribe(result => {
          if (result) {
            this.snackBar.openFromComponent(MessageSnackbarComponent, {
              duration: 3 * 1000,
              data: {
                icon: 'check',
                message: 'APP.LOGIN_SUCCESS'
              }
            });
            this.router.navigate(['/admin']);
          }
          else {
            this.snackBar.openFromComponent(MessageSnackbarComponent, {
              duration: 3 * 1000,
              data: {
                icon: 'error_outline',
                message: 'APP.LOGIN_ERROR'
              }
            });
          }
        });
      }
    });
  }

  disconnect(): void {
    this.connectionService.disconnection();

    this.snackBar.openFromComponent(MessageSnackbarComponent, {
      duration: 3 * 1000,
      data: {
        icon: 'check',
        message: 'APP.LOGOUT'
      }
    });

    this.router.navigate(['/']);
  }

}