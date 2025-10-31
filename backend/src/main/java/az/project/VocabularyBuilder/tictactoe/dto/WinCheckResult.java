package az.project.VocabularyBuilder.tictactoe.dto;

import az.project.VocabularyBuilder.tictactoe.domain.GameSide;

import java.util.List;

public record WinCheckResult(boolean isWin, GameSide winningSide, List<int[]> winningCoordinates) {
}
