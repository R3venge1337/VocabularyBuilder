package az.project.VocabularyBuilder.vocabulary.dto;

import az.project.VocabularyBuilder.vocabulary.domain.PartOfSpeech;

public record QuizQuestionDto(
        // ID encji VocabularyEntry
        Long vocabularyEntryId,

        // Słowo/fraza do przetłumaczenia
        String wordPhraseEn,
        //Poprawne tłumaczenie sprawdzające z odp użytkownika
        String translation,

        PartOfSpeech partOfSpeech
) {
}
