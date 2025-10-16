package az.project.VocabularyBuilder.vocabulary.dto;

import java.util.List;
import java.util.UUID;

public record QuizDto(
        UUID quizUuid,

        // Liczba pytań
        int totalQuestions,

        // Lista pytań
        List<QuizQuestionDto> questions
) {
}
