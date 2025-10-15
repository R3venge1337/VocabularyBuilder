package az.project.VocabularyBuilder.vocabulary.domain;

public enum ContextSource {
    MOVIE,
    SERIES, // Dodajmy osobno, bo ma odcinki
    BOOK,
    DICTIONARY,
    WEBSITE,
    GENERAL // Dla słówek, które nie mają tytułu/odcinka
}
