import { GameMoveDto } from "../../features/tic-tac-toe/models/gameMoveDto";
import { GameResult } from "../enums/gameResult";
import { GameType } from "../enums/gameType";

export interface GameReplayDto {
    sessionUuid: string;

    gameType: GameType;

    result: GameResult;

    playerSide: string;

    datePlayed: string;

    moves: GameMoveDto[];
}