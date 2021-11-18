import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';
import { Piece } from '../models/piece';
import { AppConfigService } from '../services/app-config.service';
import { MatDialog } from '@angular/material/dialog';
import { ResultDialogComponent, ResultDialogOutputData } from '../commons/dialogs/result-dialog/result-dialog.component';
import { Router } from '@angular/router';
import { AudioPuzzleManager, PlayingMode } from '../models/audio-puzzle-manager';
import { Puzzle } from '../models/puzzle';
import { ResultService } from '../services/result.service';
import { Result } from '../models/result';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit, OnDestroy {

  // données fournies par les formulaires précédents
  state: any;

  // réglage par défaut et difficulté
  nb_pieces = AppConfigService.settings.difficulty.default_pieces;
  nb_instruments = AppConfigService.settings.difficulty.default_instruments;
  available_solution = AppConfigService.settings.difficulty.default_available_solution;
  pieces_slider = AppConfigService.settings.difficulty.default_pieces_slider;
  colors: Array<string> = ['aliceblue','antiquewhite','burlywood','darkkhaki']

  puzzle: Puzzle;

  // gestion de l'audio
  audio_manager: AudioPuzzleManager;
  modes = PlayingMode;

  // timer
  startTime: number = 0;

  dragging = true;

  constructor(
    public dialog: MatDialog,
    private location: Location,
    private router: Router,
    private resultService: ResultService,
    private snackbarService: SnackbarService,
    ) { 

      this.state = this.location.getState();
      
      if(!this.state.training && (!this.state.form)) {
        this.router.navigate(['/']);
      }

      if(!this.state.difficulty) {
        this.state.difficulty = {};
        this.state.difficulty.nb_instruments = AppConfigService.settings.difficulty.default_instruments;
        this.state.difficulty.nb_pieces = AppConfigService.settings.difficulty.default_pieces;
        this.state.difficulty.available_solution = AppConfigService.settings.difficulty.default_available_solution;
        this.state.difficulty.pieces_slider = AppConfigService.settings.difficulty.default_pieces_slider;
      }

      this.nb_instruments = this.state.difficulty.nb_instruments;
      this.nb_pieces = this.state.difficulty.nb_pieces;
      this.available_solution = this.state.difficulty.available_solution;
      this.pieces_slider = this.state.difficulty.pieces_slider;
  }

  ngOnInit(): void {
    this.puzzle = new Puzzle(this.nb_pieces, this.nb_instruments)
    this.audio_manager = new AudioPuzzleManager(this.puzzle, this.state.training);

    if(!this.audio_manager.valid) {
      this.snackbarService.error(3, 'PUZZLE.NO_TRACK');
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    if (this.audio_manager) {
      this.audio_manager.stopAll();
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
    this.puzzle.pieces[event.previousContainer.data.instrument][event.previousContainer.data.order] = event.container.data.item;
    this.puzzle.pieces[event.container.data.instrument][event.container.data.order] = event.previousContainer.data.item
  }

  /**
   * condition d'acception du drag and drop pour les lignes
   * @param item 
   * @param drop 
   * @returns si la piece peut être déplacée vers la ligne d'instrument
   */
  rightPartitionPredicate = (item: CdkDrag<Piece>, drop?: CdkDropList<{item:Piece}>) => {
    return drop.data.item.instrument % this.nb_instruments === item.dropContainer.data.item.instrument;
  }

  startTimer() {
    if (this.startTime === 0) {
      this.startTime = performance.now();
    }
  }

  /**
   * Ouvre la fenêtre de récapitulatif
   */
  openResultDialog(): void {
    this.audio_manager.stopAll();
    let duration = Math.round(performance.now() - this.startTime);
    this.startTime = 0;

    let result = {score: this.puzzle.correctsPieces(), duration, audio: this.audio_manager.audio_name, order_init:this.puzzle.order_init, order_response:this.puzzle.orderPiece()}
    let post_data: Result = {...this.state, result};

    if(!this.state.training) {
      this.resultService.save_result(post_data).subscribe((result) => console.log(result));
    }

    const dialogRef = this.dialog.open(ResultDialogComponent, 
      {
        disableClose: true,
        data: {
          duration,
          pieces: this.nb_pieces,
          success_by_row: this.puzzle.correctsPiecesByRow(),
          success_total: this.puzzle.correctsPieces(),
          can_change_difficulty: !this.state.training && AppConfigService.settings.difficulty.ask_for_difficulty
        }
      });

    dialogRef.afterClosed().subscribe((result:ResultDialogOutputData) => {
      if (result === ResultDialogOutputData.difficulty) {
        this.router.navigate(['/difficulty'],{state: this.state});
      } else if (result === ResultDialogOutputData.quit) {
        this.router.navigate(['/']);
      } else if (result === ResultDialogOutputData.retry) {
        this.puzzle.buildPuzzle();
      }
    });
  }
}

