package az.project.VocabularyBuilder.tictactoe.dto;

import az.project.VocabularyBuilder.tictactoe.domain.GameResult;
import az.project.VocabularyBuilder.tictactoe.domain.GameType;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record GameReplayDto(
        UUID sessionUuid,
        GameType gameType,
        GameResult result,
        String playerSide,
        LocalDateTime datePlayed,
        List<GameMoveDto> moves
) {
}
