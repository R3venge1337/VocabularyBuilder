package az.project.VocabularyBuilder.tictactoe.domain;

import az.project.VocabularyBuilder.common.ErrorMessages;
import az.project.VocabularyBuilder.common.exception.NotFoundException;
import az.project.VocabularyBuilder.common.exception.ValidationException;
import az.project.VocabularyBuilder.tictactoe.TicTacToeFacade;
import az.project.VocabularyBuilder.tictactoe.dto.GameDto;
import az.project.VocabularyBuilder.tictactoe.dto.GameHistoryDto;
import az.project.VocabularyBuilder.tictactoe.dto.GameMoveDto;
import az.project.VocabularyBuilder.tictactoe.dto.GameReplayDto;
import az.project.VocabularyBuilder.tictactoe.dto.GameStateDto;
import az.project.VocabularyBuilder.tictactoe.dto.MoveRequestDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicTacToeService implements TicTacToeFacade {

    private final GameSessionRepository gameSessionRepository;

    // Mapa do zarządzania aktywnymi sesjami w pamięci RAM
    private final Map<UUID, GameSessionState> activeGames = new ConcurrentHashMap<>();

    // Stała dla mechanizmu timeout
    private static final Duration SESSION_TIMEOUT = Duration.ofMinutes(15);
    Random random = new Random();

    @Override
    public GameDto startGameSession() {
        UUID gameId = UUID.randomUUID();

        // Losowanie strony gracza (X zawsze zaczyna)
        GameSide playerSide = Math.random() < 0.5 ? GameSide.X : GameSide.O;
        GameSide startingSide = GameSide.X;

        GameSessionState state = new GameSessionState(gameId, playerSide, startingSide);
        activeGames.put(gameId, state);

        String message = playerSide == startingSide ?
                "Rozpoczęto! Grasz jako " + playerSide + " i zaczynasz." :
                "Rozpoczęto! Grasz jako " + playerSide + ". Czekaj na ruch komputera (X).";

        GameDto startDTO = mapToGameDto(state, message);

        // Jeśli AI zaczyna, wykonujemy pierwszy ruch od razu
        if (startingSide != playerSide) {
            // W tym miejscu wywołamy logikę ruchu AI, aby zwrócić planszę po pierwszym ruchu AI
            makeAIMove(state);
            // W tej chwili zwracamy tylko stan początkowy, a ruch AI będzie w oddzielnej metodzie lub pętli.
        }

        return startDTO;
    }

    @Override
    public GameStateDto processPlayerMove(MoveRequestDto request) {
        GameSessionState state = activeGames.get(request.gameId());
        if (state == null) {
            throw new NotFoundException("Aktywna sesja gry nie została znaleziona lub wygasła.");
        }

        GameSide playerSide = state.getPlayerSide();
        GameSide aiSide = playerSide == GameSide.X ? GameSide.O : GameSide.X;
        GameResult finalResult = null;
        String message = "";

        // 1. Walidacja ruchu gracza
        validateMove(state, request.row(), request.col());

        // 2. Wykonanie ruchu gracza
        state.getBoard()[request.row()][request.col()] = playerSide.name();

        // Dodanie ruchu gracza do tymczasowej listy
        int playerMoveNumber = state.getCurrentMoves().size() + 1;
        state.getCurrentMoves().add(new GameMove(null, playerMoveNumber, playerSide, request.row(), request.col()));

        // 3. Sprawdzenie warunków po ruchu gracza
        if (checkWinCondition(state.getBoard(), playerSide)) {
            finalResult = GameResult.WIN;
            message = "Gratulacje! Wygrałeś!";
        } else if (isBoardFull(state.getBoard())) {
            finalResult = GameResult.DRAW;
            message = "Remis! Plansza pełna.";
        }

        // 4. Jeśli gra trwa, wykonaj ruch AI
        if (finalResult == null) {

            // Logika ruchu AI
            makeAIMove(state);

            // Sprawdzenie warunków po ruchu AI
            if (checkWinCondition(state.getBoard(), aiSide)) {
                finalResult = GameResult.LOSE;
                message = "Przegrana. Komputer wygrał!";
            } else if (isBoardFull(state.getBoard())) {
                finalResult = GameResult.DRAW;
                message = "Remis! Plansza pełna.";
            } else {
                message = "Ruch komputera. Twój ruch (" + playerSide.name() + ").";
            }
        }

        // 5. Finalizacja (jeśli wynik jest określony)
        if (finalResult != null) {
            finalizeAndSaveGame(state, finalResult);
            // Ustaw nextTurn na NONE po zakończeniu, aby to było widoczne w DTO.
            state.setNextTurn(null);
        }

        // 6. Zwróć aktualny stan
        return mapToGameStateDto(state, finalResult, message);
    }

    @Override
    public GameStateDto getGameState(final UUID gameId) {
        GameSessionState state = activeGames.get(gameId);
        if (state == null) {
            throw new NotFoundException("Aktywna sesja gry nie została znaleziona lub wygasła.");
        }
        return mapToGameStateDto(state, null, "Stan planszy.");
    }

    @Override
    public List<GameHistoryDto> getGameHistory(final int limit) {
        return gameSessionRepository.findRecentHistoryNative(limit)
                .stream()
                .map(this::mapToGameHistoryDto)
                .collect(Collectors.toList());
    }

    @Override
    public GameReplayDto getGameReplay(final UUID sessionUuid) {
        GameSession session = gameSessionRepository.findByGameUuid(sessionUuid)
                .orElseThrow(() -> new NotFoundException("Historia partii nie została znaleziona.", sessionUuid));

        // Musimy upewnić się, że GameMove są załadowane (Lazy Loading)
        session.getMoves().size();

        return mapToGameReplayDto(session);
    }

    @Scheduled(fixedRateString = "${game.session.cleanup.rate:60000}")
    public void cleanupAbandonedGames() {

        Instant now = Instant.now();

        activeGames.entrySet().removeIf(entry -> {
            GameSessionState state = entry.getValue();

            if (state.getLastMoveTimestamp().plus(SESSION_TIMEOUT).isBefore(now)) {
                System.out.println("Usuwam porzuconą sesję gry: " + entry.getKey());
                return true;
            }
            return false;
        });
    }

    private GameDto mapToGameDto(GameSessionState state, String message) {
        return new GameDto(
                state.getGameId(),
                state.getPlayerSide().name(), // Mapowanie ENUM na String
                state.getBoard(),
                message
        );
    }

    private GameStateDto mapToGameStateDto(GameSessionState state, GameResult result, String message) {
        return new GameStateDto(
                state.getGameId(),
                state.getBoard(),
                state.getNextTurn().name(),
                result, // Będzie null, jeśli gra trwa
                message
        );
    }

    private GameHistoryDto mapToGameHistoryDto(GameSession session) {
        return new GameHistoryDto(
                session.getGameUuid(),
                session.getDatePlayed(),
                session.getGameType(),
                session.getResult(),
                session.getMovesCount(),
                session.getDurationSeconds()
        );
    }

    private GameReplayDto mapToGameReplayDto(GameSession session) {
        List<GameMoveDto> moveDTOs = session.getMoves().stream()
                .map(move -> new GameMoveDto(
                        move.getMoveNumber(),
                        move.getPlayerSide().name(),
                        move.getRow(),
                        move.getCol()
                ))
                .collect(Collectors.toList());

        return new GameReplayDto(
                session.getGameUuid(),
                session.getGameType(),
                session.getResult(),
                session.getPlayerSide().name(),
                session.getDatePlayed(),
                moveDTOs
        );
    }

    private boolean isBoardFull(String[][] board) {
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[i][j] == null) {
                    return false;
                }
            }
        }
        return true;
    }

    private boolean checkWinCondition(String[][] board, GameSide side) {
        String s = side.name();

        // 1. Sprawdzenie wierszy i kolumn
        for (int i = 0; i < 3; i++) {
            // Wiersze
            if (s.equals(board[i][0]) && s.equals(board[i][1]) && s.equals(board[i][2])) return true;
            // Kolumny
            if (s.equals(board[0][i]) && s.equals(board[1][i]) && s.equals(board[2][i])) return true;
        }

        // 2. Sprawdzenie przekątnych
        // Główna przekątna (0,0 -> 2,2)
        if (s.equals(board[0][0]) && s.equals(board[1][1]) && s.equals(board[2][2])) return true;
        // Antyprzekątna (0,2 -> 2,0)
        if (s.equals(board[0][2]) && s.equals(board[1][1]) && s.equals(board[2][0])) return true;

        return false;
    }

    private void validateMove(GameSessionState state, int row, int col) {
        if (row < 0 || row > 2 || col < 0 || col > 2) {
            throw new ValidationException(ErrorMessages.MOVE_BEHIND_MAP);
        }
        if (state.getBoard()[row][col] != null) {
            throw new ValidationException(ErrorMessages.FIELD_ALREADY_OCCUPIED);
        }
        // Upewniamy się też, że to kolej gracza, a nie AI.
        if (state.getNextTurn() != state.getPlayerSide()) {
            throw new ValidationException(ErrorMessages.WAIT_FOR_AI_TURN);
        }
    }

    private void makeAIMove(GameSessionState state) {
        GameSide aiSide = state.getPlayerSide() == GameSide.X ? GameSide.O : GameSide.X;

        List<int[]> emptyCells = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (state.getBoard()[i][j] == null) {
                    emptyCells.add(new int[]{i, j});
                }
            }
        }

        if (!emptyCells.isEmpty()) {
            // Wybierz losowe puste pole

            int[] move = emptyCells.get(random.nextInt(emptyCells.size()));
            int row = move[0];
            int col = move[1];

            // 1. Wykonaj ruch na planszy
            state.getBoard()[row][col] = aiSide.name();
            state.setNextTurn(state.getPlayerSide()); // Przekaż turę graczowi

            // 2. Zapisz ruch do tymczasowej listy
            int moveNumber = state.getCurrentMoves().size() + 1;
            state.getCurrentMoves().add(new GameMove(null, moveNumber, aiSide, row, col));

            // 3. Aktualizuj timestamp
            state.updateTimestamp();
        }
    }

    @Transactional // Zapewnienie, że zapis następuje atomowo
    private void finalizeAndSaveGame(GameSessionState state, GameResult finalResult) {
        Instant now = Instant.now();

        // Oblicz czas trwania
        long durationSeconds = Duration.between(state.getLastMoveTimestamp(), now).getSeconds();

        // 1. Stwórz główną encję GameSession
        GameSession session = new GameSession();
        session.setGameUuid(state.getGameId());
        session.setGameType(GameType.TIC_TAC_TOE);
        session.setPlayerSide(state.getPlayerSide());
        session.setResult(finalResult);
        session.setMovesCount(state.getCurrentMoves().size());
        session.setDatePlayed(LocalDateTime.now());
        session.setDurationSeconds((int) durationSeconds);

        // 2. Dołącz listę ruchów (ustawienie relacji)
        state.getCurrentMoves().forEach(move -> {
            move.setGameSession(session);
            session.addMove(move);
        });

        // 3. Zapisz do bazy danych (GameMove zapiszą się kaskadowo)
        gameSessionRepository.save(session);

        // 4. Usuń sesję z pamięci RAM
        activeGames.remove(state.getGameId());
    }
}

