export interface IAppConfig {
    difficulty: {
        ask_for_difficulty: boolean;

        default_instruments: number;
        default_pieces: number;

        available_instruments: number[];
        available_pieces: number[];
    }
}
