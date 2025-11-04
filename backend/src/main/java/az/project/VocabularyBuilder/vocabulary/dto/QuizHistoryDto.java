package az.project.VocabularyBuilder.vocabulary.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public interface QuizHistoryDto {

    // Nazwy metod MUSZĄ być zgodne z nazwami pól w encji (lub aliasami w zapytaniu)

    UUID getQuizUuid();

    Integer getScoreCorrect();

    Integer getScoreTotal();

    Double getAccuracyPercent();

    Integer getDurationSeconds();

    LocalDateTime getDateCompleted();
}
