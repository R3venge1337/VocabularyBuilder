package az.project.VocabularyBuilder.tictactoe.domain;

import az.project.VocabularyBuilder.common.AbstractEntityId;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldNameConstants;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "game_session")
@Getter
@Setter
@FieldNameConstants
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
class GameSession extends AbstractEntityId {

    @Column(name = "game_uuid", unique = true, nullable = false)
    private UUID gameUuid = UUID.randomUUID();

    @Enumerated(EnumType.STRING)
    @Column(name = "game_type", nullable = false)
    private GameType gameType;

    @Enumerated(EnumType.STRING)
    @Column(name = "player_side", length = 3, nullable = false)
    private GameSide playerSide;

    @Enumerated(EnumType.STRING)
    @Column(name = "result", nullable = false)
    private GameResult result;

    @Column(name = "moves_count", nullable = false)
    private Integer movesCount;

    @Column(name = "date_played", nullable = false)
    private LocalDateTime datePlayed;

    @Column(name = "duration_seconds", nullable = false)
    private Integer durationSeconds;

    @Enumerated(EnumType.STRING)
    @Column(name = "winning_side", length = 1)
    private GameSide winningSide;

    @Column(name = "won_coordinates", columnDefinition = "TEXT")
    private String wonCoordinates;

    // Relacja One-to-Many: Zapis kaskadowy ruchów
    @OneToMany(mappedBy = "gameSession", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GameMove> moves = new ArrayList<>();

    // Metoda pomocnicza do budowania relacji w kodzie
    public void addMove(GameMove move) {
        moves.add(move);
        move.setGameSession(this);
    }
}
