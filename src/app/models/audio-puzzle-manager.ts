import { AppConfigService } from "../app-config.service";
import { Piece } from "./piece";
import { Puzzle } from "./puzzle";

export enum PlayingMode {
  empty,
  solution,
  piece,
  response
}

export class AudioPuzzleManager {

  audio: HTMLAudioElement[];
  puzzle: Puzzle;
  duration: number;

  mode: PlayingMode = PlayingMode.empty;

  last_position_solution: number = 0;
  last_position_response: number = 0;
  current_piece: Piece = null;
  
  constructor(puzzle_: Puzzle) {
    this.puzzle = puzzle_;

    this.loadTracks();
  }

  loadTracks() {
    const tracks_with_correct_rows = AppConfigService.settings.tracks.filter(track => track.rows === this.puzzle.nb_instruments);
    const chosen_track_name = tracks_with_correct_rows[Math.floor(Math.random() * tracks_with_correct_rows.length)].filename;

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
        if (this.mode === PlayingMode.solution) {
          this.last_position_solution = track.currentTime;
        } else if (this.mode === PlayingMode.response) {
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
          console.log(track.currentTime);
          this.last_position_response = track.currentTime;
        } else if (this.mode === PlayingMode.piece) {
          if (track.currentTime >= (this.duration / this.puzzle.nb_pieces) * (this.current_piece.order + 1)) {
            track.pause();
            this.current_piece = null;
            this.mode = PlayingMode.empty;
          } 
        }
      }

      track.onended = () => {
        if (this.mode === PlayingMode.solution) {
          this.last_position_solution = 0;
        } else if (this.mode === PlayingMode.response) {
          this.last_position_response = 0;
        }
        this.mode = PlayingMode.empty;
        this.current_piece = null;
      }
    }
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
      this.current_piece = null;
    } else {
      this.audio.forEach(track => {
        track.pause();
      });
      this.mode = PlayingMode.empty;
      this.current_piece = null;
    }
  }

  move_solution(position: number): void {
    this.audio.forEach(track => {
      track.currentTime = position;
      this.last_position_solution = position;
    });
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

  switch_piece(piece: Piece): void {
    if (this.mode !== PlayingMode.piece || this.current_piece !== piece) {
      this.audio.forEach((track, index) => {
        if (piece.instrument === index) {
          track.currentTime = (this.duration / this.puzzle.nb_pieces) * piece.order;
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
      this.current_piece = null;
    }
  }

  position_slider_response(): number {
    return (this.duration / this.puzzle.nb_pieces) * this.puzzle.pieces[1].indexOf(this.current_piece) + (this.last_position_response % (this.duration / this.puzzle.nb_pieces));
    /*if (this.mode !== PlayingMode.response) {
    } else {
      return (this.duration / this.puzzle.nb_pieces) * this.puzzle.pieces[1].indexOf(this.current_piece) + (this.audio[0].currentTime % (this.duration / this.puzzle.nb_pieces));
    }*/
  }
}
