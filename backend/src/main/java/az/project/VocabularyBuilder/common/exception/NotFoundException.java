package az.project.VocabularyBuilder.common.exception;

import java.util.UUID;

public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }

    public NotFoundException(final UUID uuid) {
        super(String.format("No entity with UUID: %s", uuid));
    }

    public NotFoundException(final String message, final Object... args) {
        super(String.format(message, args));
    }
}
