package az.project.VocabularyBuilder.common.exception;

public class DuplicateEntryException extends RuntimeException {
    public DuplicateEntryException(String message) {
        super(message);
    }

    public DuplicateEntryException(final String message, final Object... args) {
        super(String.format(message, args));
    }

}
