package az.project.VocabularyBuilder.tictactoe.dto;

public record GameMoveDto(
        int moveNumber,
        String playerSide,
        int row,
        int col
) {
}

