export class Piece {
    instrument: number = 0;
    order: number = 0;
    empty: boolean = false;
    playing: boolean = false;

    constructor(_instrument: number, _order: number, _empty: boolean, _playing: boolean) {
        this.instrument = _instrument;
        this.order = _order
        this.empty = _empty;
        this.playing = _playing;
    }
}
