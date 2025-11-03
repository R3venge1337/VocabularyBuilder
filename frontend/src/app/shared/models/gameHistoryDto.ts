import { GameResult } from "../enums/gameResult";
import { GameType } from "../enums/gameType";

export interface GameHistoryDto {
    sessionUuid: string;

    datePlayed: string;

    gameType: GameType;

    result: GameResult;

    movesCount: number;

    durationSeconds: number;
}