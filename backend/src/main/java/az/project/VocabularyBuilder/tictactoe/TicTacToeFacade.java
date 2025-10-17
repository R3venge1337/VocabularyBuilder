package az.project.VocabularyBuilder.tictactoe;

import az.project.VocabularyBuilder.tictactoe.dto.GameDto;
import az.project.VocabularyBuilder.tictactoe.dto.GameHistoryDto;
import az.project.VocabularyBuilder.tictactoe.dto.GameReplayDto;
import az.project.VocabularyBuilder.tictactoe.dto.GameStateDto;
import az.project.VocabularyBuilder.tictactoe.dto.MoveRequestDto;

import java.util.List;
import java.util.UUID;

public interface TicTacToeFacade {

    GameDto startGameSession();

    GameStateDto processPlayerMove(final MoveRequestDto request);

    GameStateDto getGameState(final UUID gameId);

    List<GameHistoryDto> getGameHistory(final int limit);

    GameReplayDto getGameReplay(final UUID sessionUuid);
}
