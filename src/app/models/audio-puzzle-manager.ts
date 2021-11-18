import { AppConfigService } from "../services/app-config.service";
import { Piece } from "./piece";
import { Puzzle } from "./puzzle";

export enum PlayingMode {
  empty,
  solution,
  piece,
  response
}

export class AudioPuzzleManager {

  audio: HTMLAudioElement[] = [];
  audio_name = "";
  puzzle: Puzzle;
  duration: number;
  training: boolean;
  valid: boolean;

  mode: PlayingMode = PlayingMode.empty;

  last_position_solution: number = 0;
  last_position_response: number = 0;
  last_position_piece: number = 0;
  current_piece: Piece = null;
  
  constructor(puzzle_: Puzzle, _training: boolean) {
    this.puzzle = puzzle_;
    this.training = _training;

    this.valid = this.loadTracks();
  }

  loadTracks(): boolean {
    const tracks_with_correct_rows = AppConfigService.settings.tracks.filter(track => 
      track.rows === this.puzzle.nb_instruments && 
      this.training ? track.training : track.enabled
    );

    if(tracks_with_correct_rows.length == 0) {
      return false;
    }

    const chosen_track_name = tracks_with_correct_rows[Math.floor(Math.random() * tracks_with_correct_rows.length)].trackname;

    this.audio_name = chosen_track_name;

    this.audio = [];
    for (let i = 0; i < this.puzzle.nb_instruments; i++) {
      let track = new Audio();
      track.src = 'assets/audio/tracks/' + this.puzzle.nb_instruments + '/' + (i+1) + '_' + chosen_track_name;
      track.load();  
      this.audio.push(track);

      track.onloadedmetadata = () => {
        this.duration = Math.max(...this.audio.map(track => track.duration));
        track.currentTime = 0;
      }

      track.ontimeupdate = () => {
        if (this.mode === PlayingMode.solution) { // si lecture de la solution
          this.last_position_solution = track.currentTime;
        } else if (this.mode === PlayingMode.response) { // si lecture de la réponse
          if (track.currentTime > (this.duration / this.puzzle.nb_pieces) * (this.current_piece.order + 1)) {
            if (this.puzzle.nb_pieces > this.current_piece.order + 1) {
              this.current_piece = this.puzzle.pieces[this.current_piece.instrument + this.puzzle.nb_instruments][this.puzzle.pieces[this.current_piece.instrument + this.puzzle.nb_instruments].indexOf(this.current_piece) + 1];
              track.currentTime = (this.duration / this.puzzle.nb_pieces) * this.current_piece.order;
            } else {
              track.pause();
              //this.current_piece = null;
              this.mode = PlayingMode.empty;
            }
          } 
          this.last_position_response = track.currentTime;
        } else if (this.mode === PlayingMode.piece) { // si lecture d'une piece
          if (!track.paused && track.currentTime >= (this.duration / this.puzzle.nb_pieces) * (this.current_piece.order + 1)) { // si on arrive à la fin d'une pièce
            let piece_index = this.puzzle.pieces[this.puzzle.rowOfPiece(this.current_piece)].indexOf(this.current_piece);
            if (piece_index + 1 < this.puzzle.nb_pieces && this.current_piece.order + 1 < this.puzzle.nb_pieces) { // si c'est pas la derniere piece de la ligne et que c'est pas la fin de la musique
              if (this.current_piece.order + 1 === this.puzzle.pieces[this.puzzle.rowOfPiece(this.current_piece)][piece_index + 1].order) { // si la pièce suivante doit se lire sans coupure
                this.current_piece = this.puzzle.pieces[this.puzzle.rowOfPiece(this.current_piece)][piece_index + 1];
              } else {
                this.switch_piece(this.puzzle.pieces[this.puzzle.rowOfPiece(this.current_piece)][piece_index + 1]);
              }
            } else {
              track.pause();
              this.current_piece = null;
              this.mode = PlayingMode.empty;
            }
          } 
          this.last_position_piece = track.currentTime;
        }
      }

      track.onended = () => {
        if (this.mode === PlayingMode.solution) {
          this.last_position_solution = 0;
        } else if (this.mode === PlayingMode.response) {
          this.last_position_response = 0;
        } else if (this.mode === PlayingMode.piece) {
          let piece_index = this.puzzle.pieces[this.puzzle.rowOfPiece(this.current_piece)].indexOf(this.current_piece);
          if (piece_index + 1 < this.puzzle.nb_pieces) { // si c'est pas la derniere piece de la ligne
            this.switch_piece(this.puzzle.pieces[this.puzzle.rowOfPiece(this.current_piece)][piece_index + 1]);
          } else {
            this.mode = PlayingMode.empty;
            this.current_piece = null;
          }
        }

        if (this.mode !== PlayingMode.piece) {
          this.mode = PlayingMode.empty;
        }
      }
    }

    return true;
  }

  stopAll(): void {
    this.audio.forEach(track => {
      track.pause();
    });
    this.mode = PlayingMode.empty;
  }

  /**
   * lance / met en pause la musique solution
   * 
   */
  switch_solution(): void {
    if (this.mode !== PlayingMode.solution) {
      this.audio.forEach(track => {
        track.currentTime = this.last_position_solution;
        track.play();
      });
      this.mode = PlayingMode.solution;
    } else {
      this.audio.forEach(track => {
        track.pause();
      });
      this.mode = PlayingMode.empty;
    }
  }

  move_solution(position: number): void {
    if (this.mode === PlayingMode.solution) {
      this.audio.forEach(track => {
        track.currentTime = position;
      });
    }
    this.last_position_solution = position;
  }

  switch_piece(piece: Piece): void {
    if ((this.mode !== PlayingMode.piece || this.current_piece !== piece) && !piece.empty) {
      this.audio.forEach((track, index) => {
        if (piece.instrument === index) {
          if (this.current_piece === piece) {
            track.currentTime = this.last_position_piece;
          } else {
            track.currentTime = (this.duration / this.puzzle.nb_pieces) * piece.order;
          }
          this.last_position_piece = track.currentTime;
          this.current_piece = piece;
          track.play();
        } else {
          track.pause();
        }
      });
      this.mode = PlayingMode.piece;
    } else {
      this.audio.forEach(track => {
        track.pause();
      });
      this.mode = PlayingMode.empty;
      this.current_piece = piece.empty ? null : this.current_piece;
    }
  }

  move_piece(position: number, piece: Piece): void {
    if (this.mode === PlayingMode.piece) {
      this.audio.forEach((track, index) => {
        if (piece.instrument === index) {
          track.currentTime = (this.duration / this.puzzle.nb_pieces) * piece.order + position;
          this.current_piece = piece;
          track.paused ? track.play() : null;
        } else {
          track.pause();
        }
      });
    }
    this.last_position_piece = (this.duration / this.puzzle.nb_pieces) * piece.order + position;
    this.current_piece = piece;
  }

  /**
   * lance / met en pause la musique solution
   * 
   */
  switch_response(): void {
    if (this.mode !== PlayingMode.response) {
      this.audio.forEach(track => {
        track.currentTime = this.last_position_response;
        track.play();
      });
      this.current_piece = this.puzzle.pieces[this.puzzle.nb_instruments][0];
      this.mode = PlayingMode.response;
    } else {
      this.audio.forEach(track => {
        track.pause();
      });
      this.mode = PlayingMode.empty;
      this.current_piece = null;
    }
  }

  move_response(position: number): void {
    this.audio.forEach((track, index) => {
      this.current_piece = this.puzzle.pieces[index + this.puzzle.nb_instruments][Math.floor(position / (track.duration / this.puzzle.nb_pieces))];
      track.currentTime = this.current_piece.order * (track.duration / this.puzzle.nb_pieces) + (position % (track.duration / this.puzzle.nb_pieces));

      this.last_position_response = track.currentTime;
    });
  }

  position_slider_response(): number {
    return (this.duration / this.puzzle.nb_pieces) * this.puzzle.pieces[1].indexOf(this.current_piece) + (this.last_position_response % (this.duration / this.puzzle.nb_pieces));
    /*if (this.mode !== PlayingMode.response) {
    } else {
      return (this.duration / this.puzzle.nb_pieces) * this.puzzle.pieces[1].indexOf(this.current_piece) + (this.audio[0].currentTime % (this.duration / this.puzzle.nb_pieces));
    }*/
  }
}
