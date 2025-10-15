package az.project.VocabularyBuilder.vocabulary.dto;

import az.project.VocabularyBuilder.vocabulary.domain.ContextSource;
import az.project.VocabularyBuilder.vocabulary.domain.MasteryStatus;
import az.project.VocabularyBuilder.vocabulary.domain.PartOfSpeech;

public record FilterVocabularyEntryForm(String word, MasteryStatus masteryStatus, PartOfSpeech partOfSpeech,
                                        ContextSource contextSource) {
}
