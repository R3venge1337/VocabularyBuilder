package az.project.VocabularyBuilder.common.exception;

public class ValidationException extends RuntimeException {
    public ValidationException(String message) {
        super(message);
    }

    public ValidationException(final String message, final Object... args) {
        super(String.format(message, args));
    }
}
