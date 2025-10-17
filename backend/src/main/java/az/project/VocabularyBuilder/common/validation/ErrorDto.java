package az.project.VocabularyBuilder.common.validation;

public record ErrorDto(String field, String message) {
  public ErrorDto(String field, ValidationMessage message) {
    this(field, message.name());
  }

  public ErrorDto(final String message) {
    this(null, message);
  }
}