package az.project.VocabularyBuilder.vocabulary.controller;

import az.project.VocabularyBuilder.common.ControllerPaths;
import az.project.VocabularyBuilder.vocabulary.domain.ContextSource;
import az.project.VocabularyBuilder.vocabulary.domain.VocabularyQuizService;
import az.project.VocabularyBuilder.vocabulary.dto.QuizDto;
import az.project.VocabularyBuilder.vocabulary.dto.QuizHistoryDto;
import az.project.VocabularyBuilder.vocabulary.dto.QuizResultsDto;
import az.project.VocabularyBuilder.vocabulary.dto.QuizViewDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
class VocabularyQuizController {

    public static final String QUIZ_WORDS_NR = "20";
    public static final String QUIZ_HISTORY_NR = "10";
    private final VocabularyQuizService quizService;

    @GetMapping(ControllerPaths.Quiz.GENERATE)
    public QuizDto generateQuiz(
            @RequestParam(defaultValue = QUIZ_WORDS_NR) final int count) {
        return quizService.generateQuizWords(count);
    }

    @PostMapping(ControllerPaths.Quiz.SUBMIT)
    public QuizViewDto submitQuizResults(@Valid @RequestBody final QuizResultsDto results) {
        return quizService.saveQuizResults(results);
    }

    @GetMapping(ControllerPaths.Quiz.HISTORY)
    public List<QuizHistoryDto> getRecentQuizzes(
            @RequestParam(defaultValue = QUIZ_HISTORY_NR) final int limit) {
        return quizService.getRecentQuizzes(limit);
    }

    @GetMapping(ControllerPaths.Quiz.DETAILS_BY_UUID)
    public QuizViewDto getQuizDetails(@PathVariable final UUID quizUuid) {
        return quizService.getQuizByUuid(quizUuid);
    }
}
