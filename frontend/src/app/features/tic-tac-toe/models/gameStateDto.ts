import { GameResult } from "../../../shared/enums/gameResult";

export interface GameStateDto {
    /** Unikalny identyfikator gry (UUID w Javie) */
    gameId: string;
    /** Plansza 3x3. Typ komórki to 'X', 'O' lub null (puste). */
    board: (string | null)[][];
    /** Następny gracz, który ma wykonać ruch ('X' lub 'O') */
    nextPlayer: string;
    /** Rezultat gry. Null, jeśli gra nadal trwa. */
    result: GameResult | null;
    /** Wiadomość statusowa lub komunikat dla gracza */
    message: string;

    winningSide: string;

    wonCoordinates: string;
}