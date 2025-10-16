package az.project.VocabularyBuilder.vocabulary.domain;

import az.project.VocabularyBuilder.vocabulary.dto.QuizHistoryDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VocabularyQuizRepository extends JpaRepository<VocabularyQuiz, Long> {
    Optional<VocabularyQuiz> findByQuizUuid(final UUID uuid);

    @Query(value = """
                SELECT 
                    q.quizUuid,
                    q.scoreCorrect,
                    q.scoreTotal,
                    q.accuracyPercent,
                    q.durationSeconds,
                    q.dateCompleted
                FROM VocabularyQuiz q
                ORDER BY q.dateCompleted DESC
                LIMIT :limit
            """)
    List<QuizHistoryDto> findRecentQuizzes(@Param("limit") int limit);
}
