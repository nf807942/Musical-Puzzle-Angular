import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';
import { Piece } from '../models/piece';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit, OnDestroy {

  nb_pieces = 5;
  nb_instruments = 1;
  colors: Array<string> = ['aliceblue','antiquewhite','burlywood','darkkhaki']

  puzzle: Array<Array<Piece>> = [];

  audio = new Audio();
  playing_piece: Piece = null;

  rightPartitionPredicate = (item: CdkDrag<Piece>, drop?: CdkDropList<{item:Piece}>) => {
    return drop.data.item.instrument % this.nb_instruments === item.dropContainer.data.item.instrument;
  }

  constructor(
    private location:Location) { 

      const state: any = location.getState();
      
      if(state?.nb_instruments) {
        this.nb_instruments = state.nb_instruments;
        this.nb_pieces = state.nb_pieces;
      }

  }

  ngOnInit(): void {

    /**
     * Construction du puzzle
     */
    for (let j = 0; j < this.nb_instruments * 2; j++) {
      this.puzzle.push([]);
      for (let i = 0; i < this.nb_pieces; i++) {
        this.puzzle[j].push(new Piece(j, i, j >= this.nb_instruments, false));
        this.puzzle[j] = this.shuffle(this.puzzle[j]);
      }
    }

    this.audio.src = "assets/audios/satisfaction.wav";
    this.audio.load();

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
  }

  ngOnDestroy(): void {
    this.audio.pause();
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
        piece.playing = false;
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
   * Fisher-Yates shuffle
   * @param array
   * @returns 
   */
  shuffle(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

