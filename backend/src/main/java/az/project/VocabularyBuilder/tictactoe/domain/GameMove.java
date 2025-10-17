package az.project.VocabularyBuilder.tictactoe.domain;

import az.project.VocabularyBuilder.common.AbstractEntityId;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldNameConstants;

@Entity
@Table(name = "game_move")
@Getter
@Setter
@FieldNameConstants
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = true)
@Builder
@NoArgsConstructor
class GameMove extends AbstractEntityId {


    // Relacja Many-to-One: Klucz obcy do GameSession
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private GameSession gameSession;

    @Column(name = "move_number", nullable = false)
    private Integer moveNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "player_side", length = 3, nullable = false)
    private GameSide playerSide;

    @Column(name = "row_coord", nullable = false)
    private Integer row;

    @Column(name = "col_coord", nullable = false)
    private Integer col;

    // --- Konstruktor używany w serwisie do szybkiego tworzenia ---
    public GameMove(GameSession gameSession, Integer moveNumber, GameSide playerSide, Integer row, Integer col) {
        this.gameSession = gameSession;
        this.moveNumber = moveNumber;
        this.playerSide = playerSide;
        this.row = row;
        this.col = col;
    }
}
