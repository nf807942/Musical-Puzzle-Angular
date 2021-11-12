export interface IAppConfig {
    language: {
        available_languages: string[];
        default_language: string;
    }
    difficulty: {
        ask_for_difficulty: boolean;

        ask_for_instruments: boolean;
        ask_for_pieces: boolean;
        ask_for_available_solution: boolean;
        ask_for_pieces_slider: boolean;

        default_instruments: number;
        default_pieces: number;
        default_available_solution: boolean;
        default_pieces_slider: boolean;

        available_instruments: number[];
        available_pieces: number[];
    },
    form: {
        [index:string] : {
            status: string[];
            musical_experience: string[];
            musical_learning: string[];
        }
    },
    tracks: {
        rows: number;
        filename: string;
        enabled: boolean;
    } [];
    training_track : string;
}
