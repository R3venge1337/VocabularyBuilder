package az.project.VocabularyBuilder.vocabulary.controller;

import az.project.VocabularyBuilder.common.ControllerPaths;
import az.project.VocabularyBuilder.common.PageDto;
import az.project.VocabularyBuilder.common.PageableRequest;
import az.project.VocabularyBuilder.vocabulary.VocabularyEntryFacade;
import az.project.VocabularyBuilder.vocabulary.dto.CreateVocabularyEntryForm;
import az.project.VocabularyBuilder.vocabulary.dto.FilterVocabularyEntryForm;
import az.project.VocabularyBuilder.vocabulary.dto.UpdateVocabularyEntryForm;
import az.project.VocabularyBuilder.vocabulary.dto.VocabularyEntryView;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
class VocabularyEntryController {
    private final VocabularyEntryFacade entryFacade;

    @GetMapping(ControllerPaths.GET_PATH)
    PageDto<VocabularyEntryView> findEntries(final FilterVocabularyEntryForm filterForm, final PageableRequest pageableRequest) {
        return entryFacade.findVocabularyEntries(filterForm, pageableRequest);
    }

    @GetMapping(ControllerPaths.GET_PATH + "/{id}")
    public VocabularyEntryView getEntryById(@PathVariable final Long id) {
       return entryFacade.getEntryById(id);
    }

    @PostMapping(ControllerPaths.GET_PATH)
    @ResponseStatus(HttpStatus.CREATED)
    public VocabularyEntryView createEntry(@Validated @RequestBody final CreateVocabularyEntryForm request) {
        return entryFacade.createEntry(request);
    }

    @PutMapping(ControllerPaths.GET_PATH + "/{id}")
    public VocabularyEntryView updateEntry(
            @PathVariable final Long id,
            @Validated @RequestBody final UpdateVocabularyEntryForm form)
    {
        return entryFacade.updateEntry(id, form);
    }

    @DeleteMapping(ControllerPaths.GET_PATH)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEntry(@PathVariable final Long id) {
        entryFacade.deleteEntry(id);
    }
}
