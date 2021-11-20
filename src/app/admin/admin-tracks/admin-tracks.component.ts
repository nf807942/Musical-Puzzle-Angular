import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/commons/dialogs/confirm-dialog/confirm-dialog.component';
import { TrackDialogComponent } from 'src/app/commons/dialogs/track-dialog/track-dialog.component';
import { IAppConfig } from 'src/app/models/app-config';
import { Track } from 'src/app/models/track';
import { AppConfigService } from 'src/app/services/app-config.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TracksService } from 'src/app/services/tracks.service';

@Component({
  selector: 'app-admin-tracks',
  templateUrl: './admin-tracks.component.html',
  styleUrls: ['./admin-tracks.component.scss']
})
export class AdminTracksComponent implements OnInit {

  @ViewChild(MatTable) table: MatTable<Track>;

  config: IAppConfig;
  tracks: Track[];
  displayedColumns: string[] = [
    'enabled',
    'training',
    'rows',
    'trackname',
    'actions',
  ];

  constructor(
    private dialog: MatDialog,
    private configService: AppConfigService,
    private snackbarService: SnackbarService,
    private trackService: TracksService
  ) { }

  ngOnInit(): void {
    this.config = JSON.parse(JSON.stringify(AppConfigService.settings));
  }

  formatTrackName(name: string): string {
    let array: string[] = name.split('.');
    array.pop();
    return array.join();
  }

  addTrack(): void {
    const dialogRef = this.dialog.open(TrackDialogComponent, 
      {
        disableClose: true,
        minWidth: '500px'
      });
  removeTrack(track: Track): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, 
    {
      disableClose: true,
      minWidth: '400px',
      data: {
        title: 'ADMIN.TRACKS.DELETE.TITLE',
        message: 'ADMIN.TRACKS.DELETE.MESSAGE',
        yes_message: 'APP.DELETE',
        no_message: 'APP.CANCEL',
        yes_color: 'warn',
        yes_icon: 'delete',
        no_icon: 'close'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result !== null && result) {
        // supprimer les fichiers
        this.trackService.delete_track(track).subscribe(result => {
          // si réussite suppression dans le fichier de config
          if(result) {
            const index = this.config.tracks.indexOf(track, 0);
            if (index > -1) {
              this.config.tracks.splice(index, 1);
            }
            this.update();
            this.table.renderRows();
          } else {
            this.snackbarService.error(3, 'APP.UPDATE_ERROR');
          }
        },
        () => {
          this.snackbarService.error(3, 'APP.UPDATE_ERROR');
        });
      }
    });
  }

  update(): void {
    this.configService.save(this.config).subscribe((result) => {
      if (result) {
        this.snackbarService.success(3, 'APP.UPDATE_SUCCESS');
        AppConfigService.settings = this.config;
      } else {
        this.snackbarService.error(3, 'APP.UPDATE_ERROR');
        this.config = JSON.parse(JSON.stringify(AppConfigService.settings));
      }
    }, () => {
      this.snackbarService.error(3, 'APP.UPDATE_ERROR');
      this.config = JSON.parse(JSON.stringify(AppConfigService.settings));
    });
  }

}
