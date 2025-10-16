package az.project.VocabularyBuilder.vocabulary.domain;

import az.project.VocabularyBuilder.common.ErrorMessages;
import az.project.VocabularyBuilder.common.exception.NotFoundException;
import az.project.VocabularyBuilder.vocabulary.VocabularyQuizFacade;
import az.project.VocabularyBuilder.vocabulary.dto.QuizDto;
import az.project.VocabularyBuilder.vocabulary.dto.QuizHistoryDto;
import az.project.VocabularyBuilder.vocabulary.dto.QuizItemResultDto;
import az.project.VocabularyBuilder.vocabulary.dto.QuizItemView;
import az.project.VocabularyBuilder.vocabulary.dto.QuizQuestionDto;
import az.project.VocabularyBuilder.vocabulary.dto.QuizResultsDto;
import az.project.VocabularyBuilder.vocabulary.dto.QuizViewDto;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VocabularyQuizService implements VocabularyQuizFacade {

    private final VocabularyQuizRepository quizRepository;
    private final VocabularyQuizItemRepository quizItemRepository;
    private final VocabularyEntryRepository entryRepository;

    @Override
    @Transactional
    public QuizDto generateQuizWords(final int count, final List<ContextSource> contextSources) {
        List<VocabularyEntry> quizEntries = new ArrayList<>();
        int remainingCount = count;

        // Priorytety do losowego pobierania słówek: 1. TO_REVIEW, 2. LEARNING, 3. Wszystkie inne
        List<MasteryStatus> priorityStatuses = List.of(MasteryStatus.TO_REVIEW, MasteryStatus.LEARNING);

        // Zbiór ID już wybranych słówek, aby uniknąć duplikatów
        List<Long> usedEntryIds = new ArrayList<>();

        // 1. ITERACJA PRIORYTETÓW (TO_REVIEW i LEARNING)
        for (MasteryStatus status : priorityStatuses) {

            if (remainingCount <= 0) break;

            // Używamy losowego sortowania (SQL: ORDER BY random())
            // W JPA, losowe sortowanie często wymaga natywnej metody,
            // ale prostszym podejściem jest użycie klauzuli Pageable,
            // a następnie losowanie z pobranej podgrupy w Javie.

            // Pobieramy trochę więcej niż potrzebujemy, aby zwiększyć szansę na losowość
            // Użycie Sort.unsorted() plus natywna funkcja random() w repozytorium jest idealne,
            // ale dla prostoty użyjemy Pageable i posortujemy w Javie.

            // Limit pobierania to reszta + mały bufor (np. 10)
            Pageable pageable = PageRequest.of(0, remainingCount + 10, Sort.unsorted());

            List<VocabularyEntry> candidates = entryRepository.findRandomCandidates(
                    status,
                    contextSources.isEmpty() ? null : contextSources, // Przekazanie listy kontekstów
                    pageable
            );

            // Mieszanie i filtracja duplikatów
            Collections.shuffle(candidates);

            for (VocabularyEntry candidate : candidates) {
                if (remainingCount <= 0) break;
                if (!usedEntryIds.contains(candidate.getId())) {
                    quizEntries.add(candidate);
                    usedEntryIds.add(candidate.getId());
                    remainingCount--;
                }
            }
        }

        // 2. WYPEŁNIENIE DO LIMITU (Jeśli wciąż brakuje, dobieramy losowo z reszty)
        if (remainingCount > 0) {
            Pageable pageable = PageRequest.of(0, remainingCount + 10, Sort.unsorted());

            // Wyszukanie słówek, których ID jeszcze nie użyto
            List<VocabularyEntry> otherCandidates = entryRepository.findRandomRemaining(
                    usedEntryIds,
                    contextSources.isEmpty() ? null : contextSources,
                    pageable
            );

            Collections.shuffle(otherCandidates);

            for (VocabularyEntry candidate : otherCandidates) {
                if (remainingCount <= 0) break;
                if (!usedEntryIds.contains(candidate.getId())) {
                    quizEntries.add(candidate);
                    remainingCount--;
                }
            }
        }

        // Krok 3: MAPOWANIE NA DTO
        List<QuizQuestionDto> questions = quizEntries.stream()
                .map(entry -> new QuizQuestionDto(
                        entry.getId(),
                        entry.getWordPhraseEn(),
                        entry.getTranslationPl(),
                        entry.getPartOfSpeech()
                ))
                .toList();

        // Finalne mieszanie dla większej losowości w całej puli pytań
        Collections.shuffle(questions);

        // Krok 4: Zwrócenie QuizStartDTO
        return new QuizDto(
                UUID.randomUUID(),
                questions.size(),
                questions
        );
    }


    @Override
    @Transactional
    public QuizViewDto getQuizByUuid(final UUID quizUuid) {
        return quizRepository.findByQuizUuid(quizUuid)
                .map(this::mapQuizViewDto)
                .orElseThrow(() -> new NotFoundException(ErrorMessages.QUIZ_NOT_FOUND, quizUuid));
    }

    @Override
    public List<QuizHistoryDto> getRecentQuizzes(final int limit) {
        return quizRepository.findRecentQuizzes(limit);
    }

    @Override
    @Transactional
    public QuizViewDto saveQuizResults(final QuizResultsDto resultsDto) {
        final Map<Long, VocabularyEntry> entriesMap = initializeQuizData(resultsDto);

        // Liczniki quizu
        int correctCount = 0;
        int totalCount = resultsDto.results().size();

        // Tworzymy główną encję quizu
        VocabularyQuiz quiz = createVocabularyQuizEntity(resultsDto);

        final List<VocabularyQuizItem> quizItems = new ArrayList<>();

        // Krok 2: Iteracja, weryfikacja odpowiedzi i aktualizacja postępu
        for (QuizItemResultDto itemResult : resultsDto.results()) {

            VocabularyEntry entry = entriesMap.get(itemResult.entryId());

            if (entry == null) {
                // To nie powinno się zdarzyć, ale warto to obsłużyć (np. throw ResourceNotFoundException)
                continue;
            }
            correctCount = processSingleItem(itemResult, entry, correctCount, quiz, quizItems);
        }

        // Krok 5: Finalizacja i Zapis głównej encji Quizu
        double accuracy = (double) correctCount / totalCount * 100.0;

        quiz.setScoreCorrect(correctCount);
        quiz.setScoreTotal(totalCount);
        quiz.setAccuracyPercent(BigDecimal.valueOf(Math.round(accuracy * 100.0) / 100.0)); // Zaokrąglenie do 2 miejsc po przecinku

        // Zapis quizu i wszystkich jego elementów (przy założeniu kaskadowego zapisu lub osobnej repozytorium dla QuizItem)
        return mapQuizViewDto(quizRepository.save(quiz));
    }

    private int processSingleItem(final QuizItemResultDto itemResult, final VocabularyEntry entry, int correctCount, final VocabularyQuiz quiz, final List<VocabularyQuizItem> quizItems) {
        // Logika weryfikacji: normalizacja i porównanie
        String userAnswer = itemResult.userAnswer() != null ? itemResult.userAnswer().trim().toLowerCase() : "";
        String correctAnswer = entry.getTranslationPl().trim().toLowerCase();

        boolean wasCorrect = !userAnswer.isBlank() && userAnswer.equals(correctAnswer);

        if (wasCorrect) {
            correctCount++;
        }

        // Krok 3: Zapis szczegółów pytania (Quiz Item)
        createVocabularyQuizItem(itemResult, quiz, entry, wasCorrect, quizItems);

        updateMasteryStatus(entry, wasCorrect);
        return correctCount;
    }

    private static void createVocabularyQuizItem(final QuizItemResultDto itemResult, final VocabularyQuiz quiz, final VocabularyEntry entry, boolean wasCorrect, final List<VocabularyQuizItem> quizItems) {
        VocabularyQuizItem quizItem = new VocabularyQuizItem();
        quizItem.setVocabularyQuiz(quiz); // Ustawienie relacji
        quizItem.setVocabularyEntry(entry);
        quizItem.setIsCorrect(wasCorrect);
        quizItem.setUserAnswer(itemResult.userAnswer()); // Zapisujemy oryginalną odpowiedź
        quizItem.setCorrectAnswer(entry.getTranslationPl());
        quizItems.add(quizItem);
    }

    private static VocabularyQuiz createVocabularyQuizEntity(final QuizResultsDto results) {
        VocabularyQuiz quiz = new VocabularyQuiz();
        quiz.setQuizUuid(results.quizUuid());
        quiz.setDurationSeconds(results.durationSeconds());
        quiz.setDateCompleted(LocalDateTime.now());
        return quiz;
    }

    private Map<Long, VocabularyEntry> initializeQuizData(final QuizResultsDto results) {
        List<Long> entryIds = results.results().stream()
                .map(QuizItemResultDto::entryId)
                .toList();

        return entryRepository.findAllById(entryIds).stream()
                .collect(Collectors.toMap(
                        VocabularyEntry::getId,
                        Function.identity() // Mapowanie: ID słówka -> cała encja słówka
                ));
    }

    public QuizViewDto mapQuizViewDto(final VocabularyQuiz quiz) {
        return new QuizViewDto(
                quiz.getQuizUuid(),
                quiz.getScoreCorrect(),
                quiz.getScoreTotal(),
                quiz.getAccuracyPercent().doubleValue(),
                quiz.getDurationSeconds(),
                quiz.getDateCompleted(),
                quiz.getQuizItems().stream().map(this::mapToQuizItemView
                ).toList()
        );
    }

    public QuizItemView mapToQuizItemView(final VocabularyQuizItem quizItem) {
        return new QuizItemView(
                quizItem.getId(),
                quizItem.getVocabularyEntry().getWordPhraseEn(),
                quizItem.getVocabularyEntry().getPartOfSpeech(),
                quizItem.getIsCorrect(),
                quizItem.getUserAnswer(),
                quizItem.getCorrectAnswer(),
                quizItem.getVocabularyEntry().getMasteryStatus()
        );
    }

    private void updateMasteryStatus(final VocabularyEntry entry, boolean wasCorrect) {

        if (wasCorrect) {
            // 1. POPRAWNA ODPOWIEDŹ

            // Inkrementacja serii i ogólnej liczby poprawnych
            entry.setCorrectAnswerStreak(entry.getCorrectAnswerStreak() + 1);
            entry.setTotalCorrectAnswers(entry.getTotalCorrectAnswers() + 1);

            // Sprawdzenie reguły MASTERED
            if (entry.getCorrectAnswerStreak() >= 5) {
                entry.setMasteryStatus(MasteryStatus.MASTERED);
            } else if (entry.getMasteryStatus().equals(MasteryStatus.TO_REVIEW)) {
                // Jeśli było "Do Powtórki", ale zaliczone, przełącz na "Nauka"
                entry.setMasteryStatus(MasteryStatus.LEARNING);
            }

        } else {
            // 2. NIEPOPRAWNA ODPOWIEDŹ
            entry.setCorrectAnswerStreak(0);
            entry.setMasteryStatus(MasteryStatus.TO_REVIEW);
        }
        entryRepository.save(entry);
    }
}
