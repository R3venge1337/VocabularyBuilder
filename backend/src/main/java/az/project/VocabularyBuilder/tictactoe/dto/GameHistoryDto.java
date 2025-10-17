package az.project.VocabularyBuilder.tictactoe.dto;

import az.project.VocabularyBuilder.tictactoe.domain.GameResult;
import az.project.VocabularyBuilder.tictactoe.domain.GameType;

import java.time.LocalDateTime;
import java.util.UUID;

public record GameHistoryDto(
        UUID sessionUuid,
        LocalDateTime datePlayed,
        GameType gameType,
        GameResult result,
        int movesCount,
        int durationSeconds
) {
}
