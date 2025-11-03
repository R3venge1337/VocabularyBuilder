package az.project.VocabularyBuilder.vocabulary.dto;

import az.project.VocabularyBuilder.common.ErrorMessages;
import az.project.VocabularyBuilder.vocabulary.domain.ContextSource;
import az.project.VocabularyBuilder.vocabulary.domain.PartOfSpeech;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.hibernate.validator.constraints.URL;

import static az.project.VocabularyBuilder.common.Constants.URL_REGEX;

public record UpdateVocabularyEntryForm(
        @NotBlank(message = ErrorMessages.WORD_PHRASE_NEED)
        String wordPhraseEn,

        @NotBlank(message = ErrorMessages.TRANSLATION_NEED)
        String translationPl,

        @NotNull(message = ErrorMessages.PART_OF_SPEECH_NEED)
        PartOfSpeech partOfSpeech,

        @NotNull(message = ErrorMessages.CONTEXT_SOURCE_NEED)
        ContextSource contextSource,

        String sourceTitle,

        @Positive(message = ErrorMessages.NUMBER_POSITIVE)
        Integer episodeNumber,

        @Positive(message = ErrorMessages.NUMBER_POSITIVE)
        Integer timeOffsetSeconds,

        @URL(message = ErrorMessages.URL_PATTERN, regexp = URL_REGEX)
        String imageUrl
) {
}
