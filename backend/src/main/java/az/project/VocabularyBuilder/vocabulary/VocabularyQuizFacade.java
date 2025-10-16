package az.project.VocabularyBuilder.vocabulary;

import az.project.VocabularyBuilder.vocabulary.domain.ContextSource;
import az.project.VocabularyBuilder.vocabulary.dto.QuizDto;
import az.project.VocabularyBuilder.vocabulary.dto.QuizHistoryDto;
import az.project.VocabularyBuilder.vocabulary.dto.QuizResultsDto;
import az.project.VocabularyBuilder.vocabulary.dto.QuizViewDto;

import java.util.List;
import java.util.UUID;

public interface VocabularyQuizFacade {

    QuizDto generateQuizWords(final int count, final List<ContextSource> contextSources);

    QuizViewDto getQuizByUuid(final UUID quizUuid);

    List<QuizHistoryDto> getRecentQuizzes(final int limit);

    QuizViewDto saveQuizResults(final QuizResultsDto results);
}
