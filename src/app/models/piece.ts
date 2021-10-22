export class Piece {
    instrument: number = 0;
    order: number = 0;
    empty: boolean = false;
    index: number = 0;

    /**
     * 
     * @param _instrument numéro de la piste instrument (0..n)
     * @param _order emplacement correct de la pièce (0..n)
     * @param _empty cellule vide ou non
     * @param _index emplacement initial de la pièce (0..n)
     */
    constructor(_instrument: number, _order: number, _empty: boolean, _index: number) {
        this.instrument = _instrument;
        this.order = _order
        this.empty = _empty;
        this.index = _index
    }
}
