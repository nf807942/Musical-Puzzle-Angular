import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';
import { Piece } from '../models/piece';
import { AppConfigService } from '../app-config.service';
import { MatDialog } from '@angular/material/dialog';
import { ResultDialogComponent, ResultDialogOutputData } from '../commons/dialogs/result-dialog/result-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit, OnDestroy {

  state: any;

  nb_pieces = AppConfigService.settings.difficulty.default_pieces;
  nb_instruments = AppConfigService.settings.difficulty.default_instruments;
  available_solution = AppConfigService.settings.difficulty.default_available_solution;
  colors: Array<string> = ['aliceblue','antiquewhite','burlywood','darkkhaki']

  puzzle: Array<Array<Piece>>;

  audio = new Audio();
  playing_piece: Piece = null;
  audio_solution = new Audio();
  audio_solution_position: number = 0;

  rightPartitionPredicate = (item: CdkDrag<Piece>, drop?: CdkDropList<{item:Piece}>) => {
    return drop.data.item.instrument % this.nb_instruments === item.dropContainer.data.item.instrument;
  }

  constructor(
    public dialog: MatDialog,
    private location: Location,
    private router: Router) { 

      this.state = location.getState();
      
      if(!this.state.training && (!this.state.form || !this.state.difficulty)) {
        this.router.navigate(["/"]);
      }

      if(this.state.difficulty) {
        this.nb_instruments = this.state.difficulty.nb_instruments;
        this.nb_pieces = this.state.difficulty.nb_pieces;
        this.available_solution = this.state.difficulty.available_solution
      }
  }

  ngOnInit(): void {

    this.initPuzzle();

    this.audio.src = "assets/audios/satisfaction.wav";
    this.audio.load();
    this.audio_solution.src = "assets/audios/satisfaction.wav";
    this.audio_solution.load();

    /**
     * On change les icones quand la musique arrive à sa fin
     */
    this.audio.onended = () => {
      this.playing_piece.playing = false;
      this.playing_piece = null;
    }

    /**
     * On pause la musique quand la pièce atteint sa fin
     */
    this.audio.ontimeupdate = () => {
      if(this.playing_piece) {
        if (this.audio.currentTime >= (this.audio.duration / this.nb_pieces) * (this.playing_piece.order + 1)) {
          this.playing_piece.playing = false;
          this.audio.pause();
        }   
      }
    }

    /**
     * On update la position du slider de la solution à chaque instant
     */
    this.audio_solution.ontimeupdate = () => {
      this.audio_solution_position = this.audio_solution.currentTime
    }
  }

  ngOnDestroy(): void {
    this.audio.pause();
    this.audio_solution.pause();
  }

  /**
   * Construction du puzzle
   */
  initPuzzle(): void {
    this.puzzle = [];
    // pour chaque instrument (row)
    for (let j = 0; j < this.nb_instruments * 2; j++) {
      this.puzzle.push([]);
      // pour chaque emplacement
      for (let i = 0; i < this.nb_pieces; i++) {
        // ajout de la pièce
        this.puzzle[j].push(new Piece(j, i, j >= this.nb_instruments, false, 0));
      }
      // mélange du puzzle
      this.puzzle[j] = this.shuffle(this.puzzle[j]);
      // ajout des index des emplacements initiaux
      for (let i = 0; i < this.nb_pieces; i++) {
        this.puzzle[j][i].index = i;
      }
    }
  }

  getIndex(piece: Piece): string {
    return String.fromCharCode('a'.charCodeAt(0) + piece.index);
  }

  /**
   * échange l'emplacement des pièces lors d'un drag and drop
   * @param event 
   */
  drop(event: CdkDragDrop<any>): void {
    this.puzzle[event.previousContainer.data.instrument][event.previousContainer.data.order]=event.container.data.item;
    this.puzzle[event.container.data.instrument][event.container.data.order]=event.previousContainer.data.item
  }

  /**
   * lance / met en pause la musique
   * @param piece la pièce qui est cliquée
   */
  play(piece: Piece): void {
    
    if (this.audio.paused) {
      piece.playing = true;
      this.playing_piece = piece;
      this.play_at_position(piece);
    } else {
      if (piece === this.playing_piece) {
        this.playing_piece.playing = false;
        this.playing_piece = null;
        this.audio.pause();
      } else {
        this.playing_piece.playing = false;
        this.playing_piece = piece;
        piece.playing = true;
        this.play_at_position(piece);
      }
    }
  }

  /**
   * lance / met en pause la musique solution
   * 
   */
   play_solution(): void {
    
    if (this.audio_solution.paused) {
      this.audio_solution.play();
    } else {
      this.audio_solution.pause();
    }
  }

  /**
   * lance la musique à la position de la pièce
   * @param piece la pièce à jouer
   */
  play_at_position(piece: Piece): void {
    let position = (this.audio.duration / this.nb_pieces) * piece.order;
    this.audio.currentTime = position;
    this.audio.play();
  }

  /**
   * 
   * @returns si toutes les pièces sont placées
   */
  puzzle_complete(): boolean {
    let valid = true;
    for (let i = 0; i < this.nb_instruments; i++) {
      if(this.puzzle[i].find((piece) => !piece.empty) !== undefined)
      {
        valid = false
      }
    }
    return valid;
  }

  /**
   * 
   * @returns le nombre de piece correctement positionnées
   */
  corrects_pieces(): number {
    let corrects_pieces = 0;
    for (let j = this.nb_instruments; j < this.nb_instruments*2; j++) {
      for (let i = 0; i < this.nb_pieces; i++) {
        if(this.puzzle[j][i].order === i && !this.puzzle[j][i].empty) {
          corrects_pieces += 1;
        }
      }
    }
    return corrects_pieces;
  }

  /**
   * 
   * @returns le nombre de piece correctement positionnées par ligne
   */
     corrects_pieces_by_row(): number[] {
      let corrects_pieces_by_row = [];
      for (let j = this.nb_instruments; j < this.nb_instruments*2; j++) {
        let corrects_pieces = 0;
        for (let i = 0; i < this.nb_pieces; i++) {
          if(this.puzzle[j][i].order === i && !this.puzzle[j][i].empty) {
            corrects_pieces += 1;
          }
        }
        corrects_pieces_by_row.push(corrects_pieces);
      }
      return corrects_pieces_by_row;
    }

  /**
   * Fisher-Yates shuffle
   * @param array
   * @returns array randomisé
   */
  shuffle(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Ouvre la fenêtre de récapitulatif
   */
  openResultDialog(): void {
    if (this.playing_piece) {
      this.playing_piece.playing = false;
      this.playing_piece = null;
      this.audio.pause();
    }

    const dialogRef = this.dialog.open(ResultDialogComponent, 
      {
        disableClose: true,
        data: {
          duration: 5,
          pieces: this.nb_pieces,
          success_by_row: this.corrects_pieces_by_row(),
          success_total: this.corrects_pieces(),
          can_change_difficulty: !this.state.training
        }
      });

    dialogRef.afterClosed().subscribe((result:ResultDialogOutputData) => {
      if (result === ResultDialogOutputData.difficulty) {
        this.router.navigate(['/difficulty'],{state: this.state});
      } else if (result === ResultDialogOutputData.quit) {
        this.router.navigate(['/']);
      } else if (result === ResultDialogOutputData.retry) {
        this.initPuzzle();
      }
    });
  }
}

