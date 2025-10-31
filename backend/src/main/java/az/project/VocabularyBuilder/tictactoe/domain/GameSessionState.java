package az.project.VocabularyBuilder.tictactoe.domain;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class GameSessionState {
    private final UUID gameId;
    private final GameSide playerSide;
    private final String[][] board; // Aktualny stan planszy 3x3
    private Instant lastMoveTimestamp;
    private final List<GameMove> currentMoves; // Lista ruchów do utrwalenia na koniec
    private GameSide nextTurn;
    private GameSide winningSide;
    private String wonCoordinates;

    // Używamy String dla planszy (X, O, null) dla prostoty, mapując GameSide na String
    public GameSessionState(UUID gameId, GameSide playerSide, GameSide startingSide, GameSide winningSide, String wonCoordinates) {
        this.gameId = gameId;
        this.playerSide = playerSide;
        this.board = new String[3][3]; // Inicjalizacja pustej planszy (domyślnie null)
        this.lastMoveTimestamp = Instant.now();
        this.currentMoves = new ArrayList<>();
        this.nextTurn = startingSide;
        this.winningSide = winningSide;
        this.wonCoordinates = wonCoordinates;
    }

    public void updateTimestamp() {
        this.lastMoveTimestamp = Instant.now();
    }
}
