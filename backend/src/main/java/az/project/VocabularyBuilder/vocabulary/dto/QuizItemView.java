package az.project.VocabularyBuilder.vocabulary.dto;

import az.project.VocabularyBuilder.vocabulary.domain.MasteryStatus;
import az.project.VocabularyBuilder.vocabulary.domain.PartOfSpeech;

public record QuizItemView(
        Long entryId,

        // Pytanie
        String wordPhraseEn,
        PartOfSpeech partOfSpeech,

        // Wyniki
        boolean isCorrect,
        String userAnswer,
        String correctAnswer, // Tłumaczenie PL

        // Status po aktualizacji logiką Serwisu
        MasteryStatus finalMasteryStatus
) {
}
