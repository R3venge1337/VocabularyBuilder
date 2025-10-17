--liquibase formatted sql
--changeset adam.zimny:2 labels:DEV

--------------------------------------------
---------------Tables-----------------------
--------------------------------------------

CREATE TABLE game_session (
    -- Klucze i identyfikatory
    id BIGSERIAL PRIMARY KEY,

    -- Statystyki partii
    game_type VARCHAR(50) NOT NULL,    -- Typ gry ('TIC_TAC_TOE', itp.)
    player_side VARCHAR(3) NOT NULL,    -- Strona gracza lokalnego ('X' lub 'O')
    result VARCHAR(20) NOT NULL,         -- Wynik z perspektywy gracza ('WIN', 'LOSS', 'DRAW')
    moves_count INTEGER NOT NULL,        -- Całkowita liczba ruchów

    -- Czas i daty
    date_played TIMESTAMP WITHOUT TIME ZONE NOT NULL, -- Data i czas zakończenia
    duration_seconds INTEGER NOT NULL               -- Czas trwania
);

-- Opcjonalnie: Indeksowanie dla szybkiego pobierania historii gier
CREATE INDEX idx_game_session_date_played ON game_session (date_played DESC);
CREATE INDEX idx_game_session_game_type ON game_session (game_type);


-- 2. Tabela: game_move (Szczegóły pojedynczego ruchu)
CREATE TABLE game_move (
    -- Klucze
    id BIGSERIAL PRIMARY KEY,

    -- Klucz Obcy łączący ruch z sesją
    session_id BIGINT NOT NULL,

    -- Szczegóły ruchu
    move_number INTEGER NOT NULL,      -- Numer ruchu w sekwencji (1, 2, 3...)
    player_side VARCHAR(3) NOT NULL,  -- Gracz, który wykonał ruch
    row_coord INTEGER NOT NULL,        -- Współrzędna wiersza (0-2)
    col_coord INTEGER NOT NULL,        -- Współrzędna kolumny (0-2)

    -- Ograniczenie: Definicja Klucza Obcego
    CONSTRAINT fk_game_move_session_id
        FOREIGN KEY (session_id)
        REFERENCES game_session (id)
        ON DELETE CASCADE
);

-- Opcjonalnie: Indeksowanie dla szybkiego pobierania sekwencji ruchów
CREATE INDEX idx_game_move_session_id ON game_move (session_id);

--rollback DROP TABLE game_move;
--rollback DROP TABLE game_session;