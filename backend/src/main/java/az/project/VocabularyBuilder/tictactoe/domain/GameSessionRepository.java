package az.project.VocabularyBuilder.tictactoe.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
interface GameSessionRepository extends JpaRepository<GameSession, Long> {
    Optional<GameSession> findByGameUuid(final UUID gameUuid);

    @Query(value = "SELECT * FROM game_session ORDER BY date_played DESC LIMIT :limit", nativeQuery = true)
    List<GameSession> findRecentHistoryNative(@Param("limit") int limit);
}
