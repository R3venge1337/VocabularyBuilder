package az.project.VocabularyBuilder.tictactoe.dto;

import az.project.VocabularyBuilder.tictactoe.domain.GameResult;

import java.util.UUID;

public record GameStateDto(
        UUID gameId,
        String[][] board,
        String nextPlayer,
        GameResult result, // Null, jeśli gra trwa
        String message,
        String winningSide,
        String wonCoordinates
) {
}
