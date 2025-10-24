import { PartOfSpeech } from "../../../shared/enums/partOfSpeech";

export interface QuizQuestionDto {
    /** ID encji VocabularyEntry */
    vocabularyEntryId: number;

    /** Słowo/fraza do przetłumaczenia (angielski) */
    wordPhraseEn: string;
    
    /** Poprawne tłumaczenie sprawdzające z odpowiedzią użytkownika */
    translation: string;

    /** Część mowy (np. rzeczownik, czasownik) */
    partOfSpeech: PartOfSpeech;
}

/**
 * Odpowiednik QuizDto (Java record).
 * Zawiera ogólne informacje o quizie oraz listę pytań.
 */
export interface QuizDto {
    /** Unikalny identyfikator quizu (UUID w formie stringa) */
    quizUuid: string;

    /** Liczba pytań w quizie */
    totalQuestions: number;

    /** Lista pytań do quizu */
    questions: QuizQuestionDto[];
}