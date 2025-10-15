package az.project.VocabularyBuilder.vocabulary.domain;

import az.project.VocabularyBuilder.common.PredicateUtils;
import az.project.VocabularyBuilder.vocabulary.dto.FilterVocabularyEntryForm;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
class VocabularyEntrySpecification implements Specification<VocabularyEntry> {
    private final FilterVocabularyEntryForm filterForm;

    @Override
    public Predicate toPredicate(Root<VocabularyEntry> root, CriteriaQuery<?> query, CriteriaBuilder builder) {

        List<Predicate> predicates = new ArrayList<>();

        PredicateUtils.addMultipleLikePredicate(
                builder,
                predicates,
                List.of(root.get("wordPhraseEn"), root.get("sourceTitle")),
                filterForm.word()
        );

        PredicateUtils.addEqualPredicate(
                builder,
                predicates,
                root.get("masteryStatus"),
                filterForm.masteryStatus()
        );

        PredicateUtils.addEqualPredicate(
                builder,
                predicates,
                root.get("partOfSpeech"),
                filterForm.partOfSpeech()
        );

        PredicateUtils.addEqualPredicate(
                builder,
                predicates,
                root.get("contextSource"),
                filterForm.contextSource()
        );

        return PredicateUtils.buildAndPredicates(builder, predicates);
    }
}
