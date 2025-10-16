package az.project.VocabularyBuilder.common;

public class ErrorMessages {

    // --- Walidacja Podstawowa  ---
    public static final String WORD_PHRASE_NEED = "Słowo/fraza jest wymagane.";
    public static final String TRANSLATION_NEED = "Tłumaczenie jest wymagane.";
    public static final String PART_OF_SPEECH_NEED = "Część mowy jest wymagana.";
    public static final String CONTEXT_SOURCE_NEED = "Typ źródła kontekstu jest wymagany.";
    public static final String NUMBER_POSITIVE = "Wartość musi być liczbą dodatnią.";

    // --- Błędy Zasobów  ---
    public static final String VOCABULARY_ENTRY_NOT_FOUND = "Nie znaleziono słowa w słowniku.";
    public static final String QUIZ_NOT_FOUND = "Nie znaleziono danego testu/quizu";
    // --- Walidacja Logiki Biznesowej (Używana w Serwisie) ---
    public static final String DUPLICATE_ENTRY = "Słowo o tej części mowy już istnieje w Twoim słowniku.";
    public static final String CONTEXT_SERIES_REQUIRED = "Dla SERIALU wymagany jest tytuł źródła i numer odcinka.";
    public static final String CONTEXT_MOVIE_REQUIRED = "Dla FILMU wymagany jest tytuł źródła.";
    public static final String CONTEXT_BOOK_REQUIRED = "Dla KSIĄŻKI wymagany jest tytuł źródła.";
    public static final String CONTEXT_MUST_BE_NULL = "Pola kontekstowe (tytuł, odcinek, czas) muszą być puste dla tego typu źródła.";
}
