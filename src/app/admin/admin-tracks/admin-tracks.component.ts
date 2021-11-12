import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TrackDialogComponent } from 'src/app/commons/dialogs/track-dialog/track-dialog.component';

@Component({
  selector: 'app-admin-tracks',
  templateUrl: './admin-tracks.component.html',
  styleUrls: ['./admin-tracks.component.scss']
})
export class AdminTracksComponent implements OnInit {

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
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
      }
    });
  }

}
