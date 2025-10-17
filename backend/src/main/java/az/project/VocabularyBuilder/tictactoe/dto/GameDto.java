package az.project.VocabularyBuilder.tictactoe.dto;

import java.util.UUID;

public record GameDto(
        UUID gameId,
        String playerSide,
        String[][] board, // Plansza 3x3
        String message
) {
}
