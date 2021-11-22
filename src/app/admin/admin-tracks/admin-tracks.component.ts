import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
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
export class AdminTracksComponent implements OnInit, OnDestroy {

  @ViewChild(MatTable) table: MatTable<Track>;

  config: IAppConfig;
  displayedColumns: string[] = [
    'play',
    'enabled',
    'training',
    'rows',
    'trackname',
    'actions',
  ];

  audio: HTMLAudioElement[][] = [];
  playing_index: number = null;

  constructor(
    private dialog: MatDialog,
    private configService: AppConfigService,
    private snackbarService: SnackbarService,
    private trackService: TracksService
  ) { }

  ngOnInit(): void {
    this.config = JSON.parse(JSON.stringify(AppConfigService.settings));

    for (let track of this.config.tracks) {
      this.pushAudio(track.rows, track.trackname);
    }
  }

  ngOnDestroy(): void {
    this.stopAll();
  }

  stopAll(): void {
    for (let track of this.audio) {
      for (let subtrack of track) {
        subtrack.pause();
      }
    }
    this.playing_index = null;
  }

  play(track: Track): void {
    if (this.playing_index !== null) {
      for (let i = 0; i < this.config.tracks[this.playing_index].rows; i++) {
        this.audio[this.playing_index][i].pause();
      }
    }
    if (this.isPlaying(track)) {
      this.playing_index = null;
    } else {
      this.playing_index = this.config.tracks.indexOf(track);
      for (let i = 0; i < track.rows; i++) {
        this.audio[this.playing_index][i].currentTime = 0;
        this.audio[this.playing_index][i].play();
      }
    }
  }

  isPlaying(track: Track): boolean {
    return this.config.tracks.indexOf(track) === this.playing_index;
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

    dialogRef.afterClosed().subscribe((form) => {
      if(form !== null) {
        this.snackbarService.loading();
        this.trackService.add_track(form).subscribe(result => {
          // si réussite ajout dans le fichier de config
          if(result) {
            this.config.tracks.push({rows: form.list.length, trackname: form.name + '.mp3', enabled: false, training: false});
            this.update();
            this.table.renderRows();

            this.pushAudio(form.list.length, form.name + '.mp3');

          } else {
            this.snackbarService.error(3, 'APP.UPDATE_ERROR');
          }
        });
      }
    });
  }

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
        this.snackbarService.loading();
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

            this.stopAll();
          } else {
            this.snackbarService.error(3, 'APP.UPDATE_ERROR');
          }
        });
      }
    });
  }

  update(): void {
    this.snackbarService.loading();
    this.configService.save(this.config).subscribe((result) => {
      if (result) {
        this.snackbarService.success(3, 'APP.UPDATE_SUCCESS');
        AppConfigService.settings = this.config;
      } else {
        this.snackbarService.error(3, 'APP.UPDATE_ERROR');
        this.config = JSON.parse(JSON.stringify(AppConfigService.settings));
      }
    });
  }

  pushAudio(rows: number, name: string): void {
    let index = this.audio.push([]) - 1;
    for (let i = 0; i < rows; i++) {
      let subtrack = new Audio();
      subtrack.src = 'assets/audio/tracks/' + rows + '/' + (i+1) + '_' + name;
      this.audio[index].push(subtrack);

      subtrack.onended = () => {
        this.playing_index = null;
      }
    }
  }

}
