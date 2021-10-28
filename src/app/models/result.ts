export interface Result {
    form: {
        email: string;
        age: number;
        status: string;
        experience: string;
        learning: string;
        instruments: string;
        practice: string;
    },
    difficulty: {
        nb_pieces: number;
        nb_instruments: number;
        available_solution: boolean;
        pieces_slider: boolean;
    },
    result: {
        date: Date,
        audio: string,
        score: number,
        time: number,
        order_init: number[],
        order_response: number[],
    }
}
