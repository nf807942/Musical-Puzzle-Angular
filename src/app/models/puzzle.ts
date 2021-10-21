import { Piece } from "./piece";

export class Puzzle {
  pieces: Array<Array<Piece>>;
  nb_pieces: number;
  nb_instruments: number;

  order_init: number[];

  constructor(nb_pieces_: number, nb_instruments_: number) {
    this.nb_pieces = nb_pieces_;
    this.nb_instruments = nb_instruments_;

    this.buildPuzzle();
  }

  buildPuzzle(): void {
    this.pieces = [];
    this.order_init = [];
    // pour chaque instrument (row)
    for (let j = 0; j < this.nb_instruments * 2; j++) {
      this.pieces.push([]);
      // pour chaque emplacement
      for (let i = 0; i < this.nb_pieces; i++) {
        // ajout de la pièce
        this.pieces[j].push(new Piece(j, i, j >= this.nb_instruments, false, 0));
      }
      // mélange du puzzle
      this.pieces[j] = this.shuffle(this.pieces[j]);
      // ajout des index des emplacements initiaux
      for (let i = 0; i < this.nb_pieces; i++) {
        this.pieces[j][i].index = i;
      }
    }
    this.order_init = this.orderPiece();
  }

  /**
   * 
   * @returns si toutes les pièces sont placées
   */
   complete(): boolean {
    let valid = true;
    for (let i = 0; i < this.nb_instruments; i++) {
      if(this.pieces[i].find((piece) => !piece.empty) !== undefined)
      {
        valid = false
      }
    }
    return valid;
  }

  /**
   * 
   * @returns le nombre de piece correctement positionnées au total
   */
  correctsPieces(): number {
    return this.correctsPiecesByRow().reduce((corrects_total, corrects_row) => corrects_total + corrects_row, 0);
  }

  /**
   * 
   * @returns le nombre de piece correctement positionnées par ligne
   */
  correctsPiecesByRow(): number[] {
    let corrects_pieces_by_row = [];
    for (let j = this.nb_instruments; j < this.nb_instruments*2; j++) {
      let corrects_pieces = 0;
      for (let i = 0; i < this.nb_pieces; i++) {
        if(this.pieces[j][i].order === i && !this.pieces[j][i].empty) {
          corrects_pieces += 1;
        }
      }
      corrects_pieces_by_row.push(corrects_pieces);
    }
    return corrects_pieces_by_row;
  }

  /**
   * 
   * @returns l'ordre des pièces (gauche-droite haut-bas)
   */
   orderPiece(): number[] {
    let order_response = [];
    this.pieces.forEach(intrument => {
      intrument.forEach(piece =>{
        if (!piece.empty) {
          order_response.push(piece.order);
        }
      })
    });
    return order_response;
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

}
