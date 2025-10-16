package az.project.VocabularyBuilder.vocabulary.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.util.List;
import java.util.UUID;

public record QuizResultsDto(
        @NotNull
        UUID quizUuid,

        @PositiveOrZero
        int durationSeconds, // Czas trwania quizu

        @NotEmpty
        List<QuizItemResultDto> results // Wyniki poszczególnych pytań
) {
}
