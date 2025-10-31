import { GameSide } from "../../../shared/enums/gameSide";

export interface GameMoveDto {
    row: number;
    col: number;
    player: GameSide; // Kto wykonał ruch
    moveTime: Date; // Kiedy ruch został wykonany
}