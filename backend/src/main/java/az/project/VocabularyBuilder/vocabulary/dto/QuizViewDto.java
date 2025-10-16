package az.project.VocabularyBuilder.vocabulary.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record QuizViewDto(
        // --- Ogólne Statystyki Quizu ---
        UUID quizUuid,

        int scoreCorrect,
        int scoreTotal,

        // Dokładność procentowa (np. 85.71)
        double accuracyPercent,

        int durationSeconds,
        LocalDateTime dateCompleted,

        // --- Szczegółowe Wyniki Pytań ---
        List<QuizItemView> itemResults
) {
}
