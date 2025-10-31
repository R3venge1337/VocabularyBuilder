export interface GameDto {
    /** Unikalny identyfikator gry (UUID w Javie) */
    gameId: string;
    /** Strona gracza ('X' lub 'O') */
    playerSide: string; 
    /** Plansza 3x3. Typ komórki to 'X', 'O' lub null (puste). */
    board: (string | null)[][]; 
    /** Wiadomość statusowa lub komunikat powitalny/błędu */
    message: string;
}