package az.project.VocabularyBuilder.tictactoe.controller;

import az.project.VocabularyBuilder.common.ControllerPaths;
import az.project.VocabularyBuilder.tictactoe.TicTacToeFacade;
import az.project.VocabularyBuilder.tictactoe.dto.GameDto;
import az.project.VocabularyBuilder.tictactoe.dto.GameHistoryDto;
import az.project.VocabularyBuilder.tictactoe.dto.GameReplayDto;
import az.project.VocabularyBuilder.tictactoe.dto.GameStateDto;
import az.project.VocabularyBuilder.tictactoe.dto.MoveRequestDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
class TicTacToeController {
    private final TicTacToeFacade ticTacToeFacade;

    @PostMapping(ControllerPaths.TicTacToe.GAME_START)
    public GameDto startGame() {
        return ticTacToeFacade.startGameSession();
    }

    @PostMapping(ControllerPaths.TicTacToe.GAME_MOVE)
    public GameStateDto makeMove(@Valid @RequestBody final MoveRequestDto request) {
        return ticTacToeFacade.processPlayerMove(request);
    }

    @GetMapping(ControllerPaths.TicTacToe.GAME_HISTORY)
    public List<GameHistoryDto> getHistory(@RequestParam(defaultValue = "10") final int limit) {
        return ticTacToeFacade.getGameHistory(limit);
    }


    @GetMapping(ControllerPaths.TicTacToe.GAME_REPLAY)
    public GameReplayDto getReplay(@PathVariable final UUID sessionUuid) {
        return ticTacToeFacade.getGameReplay(sessionUuid);
    }
}
