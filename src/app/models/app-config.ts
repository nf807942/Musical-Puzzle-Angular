export interface IAppConfig {
    difficulty: {
        ask_for_difficulty: boolean;
        ask_for_available_solution: boolean

        default_instruments: number;
        default_pieces: number;
        default_available_solution: boolean;

        available_instruments: number[];
        available_pieces: number[];
    },
    form: {
        status: string[],
        musical_experience: string[],
        musical_learning: string[]
    },
    tracks: {
        rows: number, 
        filename: string} []
}
