package az.project.VocabularyBuilder.vocabulary.dto;

import jakarta.validation.constraints.NotNull;

public record QuizItemResultDto(
        @NotNull
        Long entryId,

        String userAnswer // Odpowiedź wpisana przez użytkownika
) {
}
