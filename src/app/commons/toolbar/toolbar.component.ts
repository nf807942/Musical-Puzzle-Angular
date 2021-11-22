import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppConfigService } from 'src/app/services/app-config.service';
import { ConnectionService } from 'src/app/services/connection.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { PasswordDialogComponent } from '../dialogs/password-dialog/password-dialog.component';

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
    private snackBarService: SnackbarService,
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

    dialogRef.afterClosed().subscribe((password) => {
      if(password !== null) {
        this.snackBarService.loading();
        this.connectionService.connection(password).subscribe(result => {
          if (result) {
            this.snackBarService.success(3, 'APP.LOGIN_SUCCESS');
            this.router.navigate(['/admin']);
          }
          else {
            this.snackBarService.error(3, 'APP.LOGIN_ERROR');
          }
        });
      }
    });
  }

  disconnect(): void {
    this.connectionService.disconnection();

    this.snackBarService.success(3, 'APP.LOGOUT');

    this.router.navigate(['/']);
  }

}