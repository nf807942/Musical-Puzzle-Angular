import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Observable } from 'rxjs';
import { TrackDialogComponent } from 'src/app/commons/dialogs/track-dialog/track-dialog.component';
import { IAppConfig } from 'src/app/models/app-config';
import { Track } from 'src/app/models/track';
import { AppConfigService } from 'src/app/services/app-config.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

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

    dialogRef.afterClosed().subscribe((result) => {
      if(result !== null) {
        console.log(result)

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
