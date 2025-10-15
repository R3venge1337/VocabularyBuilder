package az.project.VocabularyBuilder.vocabulary.dto;

import az.project.VocabularyBuilder.vocabulary.domain.ContextSource;
import az.project.VocabularyBuilder.vocabulary.domain.MasteryStatus;
import az.project.VocabularyBuilder.vocabulary.domain.PartOfSpeech;

import java.time.LocalDateTime;

public record VocabularyEntryView(
        Long id,
        String wordPhraseEn,
        String translationPl,
        PartOfSpeech partOfSpeech,
        MasteryStatus masteryStatus,
        Integer correctAnswerStreak,
        Integer totalCorrectAnswers,
        LocalDateTime createdAt,
        ContextSource contextSource,
        String sourceTitle,
        Integer episodeNumber,
        Integer timeOffsetSeconds
) {
}
