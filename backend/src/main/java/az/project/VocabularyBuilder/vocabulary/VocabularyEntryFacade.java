package az.project.VocabularyBuilder.vocabulary;

import az.project.VocabularyBuilder.common.PageDto;
import az.project.VocabularyBuilder.common.PageableRequest;
import az.project.VocabularyBuilder.vocabulary.dto.CreateVocabularyEntryForm;
import az.project.VocabularyBuilder.vocabulary.dto.FilterVocabularyEntryForm;
import az.project.VocabularyBuilder.vocabulary.dto.UpdateVocabularyEntryForm;
import az.project.VocabularyBuilder.vocabulary.dto.VocabularyEntryView;

public interface VocabularyEntryFacade {
    VocabularyEntryView createEntry(final CreateVocabularyEntryForm form);

    VocabularyEntryView getEntryById(final Long id);

    VocabularyEntryView updateEntry(final Long id, final UpdateVocabularyEntryForm form);

    void deleteEntry(final Long id);

    PageDto<VocabularyEntryView> findVocabularyEntries(final FilterVocabularyEntryForm filterForm, final PageableRequest pageableRequest);

    long countEntry();


}
