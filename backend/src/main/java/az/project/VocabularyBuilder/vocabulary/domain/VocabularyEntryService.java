package az.project.VocabularyBuilder.vocabulary.domain;

import az.project.VocabularyBuilder.common.ErrorMessages;
import az.project.VocabularyBuilder.common.PageDto;
import az.project.VocabularyBuilder.common.PageableRequest;
import az.project.VocabularyBuilder.common.PageableUtils;
import az.project.VocabularyBuilder.common.exception.DuplicateEntryException;
import az.project.VocabularyBuilder.common.exception.NotFoundException;
import az.project.VocabularyBuilder.common.exception.ValidationException;
import az.project.VocabularyBuilder.vocabulary.VocabularyEntryFacade;
import az.project.VocabularyBuilder.vocabulary.dto.CreateVocabularyEntryForm;
import az.project.VocabularyBuilder.vocabulary.dto.FilterVocabularyEntryForm;
import az.project.VocabularyBuilder.vocabulary.dto.UpdateVocabularyEntryForm;
import az.project.VocabularyBuilder.vocabulary.dto.VocabularyEntryView;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
class VocabularyEntryService implements VocabularyEntryFacade {

    private final VocabularyEntryRepository repository;

    @Override
    public PageDto<VocabularyEntryView> findVocabularyEntries(final FilterVocabularyEntryForm filterForm, final PageableRequest pageableRequest) {

        final VocabularyEntrySpecification teacherSpecification = new VocabularyEntrySpecification(filterForm);

        final Page<VocabularyEntryView> vocabularyEntryViews = repository.findAll(teacherSpecification, PageableUtils.createPageable(pageableRequest))
                .map(this::mapToVocabularyEntryView);

        return PageableUtils.toDto(vocabularyEntryViews);
    }

    @Override
    public long countEntry() {
        return repository.count();
    }

    @Override
    @Transactional
    public VocabularyEntryView createEntry(final CreateVocabularyEntryForm form) {

        Optional<VocabularyEntry> existingEntry = repository.findByWordPhraseEnAndPartOfSpeech(
                form.wordPhraseEn(),
                form.partOfSpeech()
        );

        if (existingEntry.isPresent()) {
            throw new DuplicateEntryException(ErrorMessages.DUPLICATE_ENTRY);
        }

        validateContext(form);

        VocabularyEntry newEntry = createRequestToEntry(form);

        newEntry.setMasteryStatus(MasteryStatus.LEARNING);
        newEntry.setCorrectAnswerStreak(0);
        newEntry.setTotalCorrectAnswers(0);

        return mapToVocabularyEntryView(repository.save(newEntry));
    }

    @Override
    public VocabularyEntryView getEntryById(final Long id) {
        return repository.findById(id).map(this::mapToVocabularyEntryView)
                .orElseThrow(() -> new NotFoundException(ErrorMessages.VOCABULARY_ENTRY_NOT_FOUND));
    }

    @Override
    public VocabularyEntryView updateEntry(final Long id, final UpdateVocabularyEntryForm form) {
        VocabularyEntry existingEntry = repository.findById(id)
                .orElseThrow(() -> new NotFoundException(ErrorMessages.VOCABULARY_ENTRY_NOT_FOUND));

        if (!existingEntry.getWordPhraseEn().equals(form.wordPhraseEn()) || !existingEntry.getPartOfSpeech().equals(form.partOfSpeech())) {
            repository.findByWordPhraseEnAndPartOfSpeech(form.wordPhraseEn(), form.partOfSpeech())
                    .ifPresent(entry -> {
                        if (!entry.getId().equals(existingEntry.getId())) {
                            throw new DuplicateEntryException(ErrorMessages.DUPLICATE_ENTRY);
                        }
                    });
        }

        validateContext(form);

        VocabularyEntry updatedEntry = mapToEntry(form, existingEntry);

        return mapToVocabularyEntryView(repository.save(updatedEntry));
    }

    @Override
    public void deleteEntry(final Long id) {
        repository.deleteById(id);
    }

    private void validateContext(final CreateVocabularyEntryForm request) {
        // Logika warunkowa: Jeśli SERIAL, to tytuł i odcinek muszą być!
        if (request.contextSource() == ContextSource.SERIES) {
            if (request.sourceTitle() == null || request.sourceTitle().isBlank() || request.episodeNumber() == null) {
                throw new ValidationException(ErrorMessages.CONTEXT_SERIES_REQUIRED);
            }
        }

        // Logika warunkowa: Jeśli MOVIE/BOOK, to tytuł musi być!
        if (request.contextSource() == ContextSource.MOVIE || request.contextSource() == ContextSource.BOOK) {
            if (request.sourceTitle() == null || request.sourceTitle().isBlank()) {
                throw new ValidationException(request.contextSource() == ContextSource.MOVIE ? ErrorMessages.CONTEXT_MOVIE_REQUIRED : ErrorMessages.CONTEXT_BOOK_REQUIRED);
            }
        }

        // Logika warunkowa: Jeśli GENERAL/DICTIONARY, to pola kontekstowe muszą być puste!
        if (request.contextSource() == ContextSource.GENERAL || request.contextSource() == ContextSource.DICTIONARY) {
            if (request.sourceTitle() != null || request.episodeNumber() != null || request.timeOffsetSeconds() != null) {
                throw new ValidationException(ErrorMessages.CONTEXT_MUST_BE_NULL);
            }
        }

    }

    private void validateContext(final UpdateVocabularyEntryForm request) {
        // Logika warunkowa: Jeśli SERIAL, to tytuł i odcinek muszą być!
        if (request.contextSource() == ContextSource.SERIES) {
            if (request.sourceTitle() == null || request.sourceTitle().isBlank() || request.episodeNumber() == null) {
                throw new ValidationException(ErrorMessages.CONTEXT_SERIES_REQUIRED);
            }
        }

        // Logika warunkowa: Jeśli MOVIE/BOOK, to tytuł musi być!
        if (request.contextSource() == ContextSource.MOVIE || request.contextSource() == ContextSource.BOOK) {
            if (request.sourceTitle() == null || request.sourceTitle().isBlank()) {
                throw new ValidationException(request.contextSource() == ContextSource.MOVIE ? ErrorMessages.CONTEXT_MOVIE_REQUIRED : ErrorMessages.CONTEXT_BOOK_REQUIRED);
            }
        }

        // Logika warunkowa: Jeśli GENERAL/DICTIONARY, to pola kontekstowe muszą być puste!
        if (request.contextSource() == ContextSource.GENERAL || request.contextSource() == ContextSource.DICTIONARY) {
            if (request.sourceTitle() != null || request.episodeNumber() != null || request.timeOffsetSeconds() != null) {
                throw new ValidationException(ErrorMessages.CONTEXT_MUST_BE_NULL);
            }
        }

    }

    private VocabularyEntry createRequestToEntry(final CreateVocabularyEntryForm request) {
        VocabularyEntry entry = new VocabularyEntry();
        entry.setWordPhraseEn(request.wordPhraseEn());
        entry.setTranslationPl(request.translationPl());
        entry.setPartOfSpeech(request.partOfSpeech());
        entry.setContextSource(request.contextSource());
        entry.setSourceTitle(request.sourceTitle());
        entry.setEpisodeNumber(request.episodeNumber());
        entry.setTimeOffsetSeconds(request.timeOffsetSeconds());
        return entry;
    }

    private VocabularyEntryView mapToVocabularyEntryView(final VocabularyEntry entry) {
        return new VocabularyEntryView(
                entry.getId(),
                entry.getWordPhraseEn(),
                entry.getTranslationPl(),
                entry.getPartOfSpeech(),
                entry.getMasteryStatus(),
                entry.getCorrectAnswerStreak(),
                entry.getTotalCorrectAnswers(),
                entry.getCreatedAt(),
                entry.getContextSource(),
                entry.getSourceTitle(),
                entry.getEpisodeNumber(),
                entry.getTimeOffsetSeconds()
        );
    }

    public VocabularyEntry mapToEntry(final UpdateVocabularyEntryForm view, VocabularyEntry entry) {

        entry.setWordPhraseEn(view.wordPhraseEn());
        entry.setTranslationPl(view.translationPl());
        entry.setPartOfSpeech(view.partOfSpeech());

        entry.setContextSource(view.contextSource());
        entry.setSourceTitle(view.sourceTitle());
        entry.setEpisodeNumber(view.episodeNumber());
        entry.setTimeOffsetSeconds(view.timeOffsetSeconds());

        return entry;
    }
}
