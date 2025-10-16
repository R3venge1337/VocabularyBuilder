package az.project.VocabularyBuilder.vocabulary.domain;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VocabularyEntryRepository extends JpaRepository<VocabularyEntry, Long>, JpaSpecificationExecutor<VocabularyEntry> {

    @Query("SELECT v FROM VocabularyEntry v WHERE v.wordPhraseEn = :word AND v.partOfSpeech = :pos")
    Optional<VocabularyEntry> findByWordPhraseEnAndPartOfSpeech(
            @Param("word") String wordPhraseEn,
            @Param("pos") PartOfSpeech partOfSpeech
    );

    @Query("SELECT e FROM VocabularyEntry e WHERE e.masteryStatus = :status " +
            "AND (:#{#contextSources} IS NULL OR e.contextSource IN :contextSources) " +
            "ORDER BY FUNCTION('RANDOM')") // Użycie natywnej funkcji RANDOM() dla PostgreSQL
    List<VocabularyEntry> findRandomCandidates(@Param("status") MasteryStatus status,
                                               @Param("contextSources") List<ContextSource> contextSources,
                                               Pageable pageable);

    // 2. Pobieranie pozostałych słówek (wypełnianie luki)
    @Query("SELECT e FROM VocabularyEntry e WHERE e.id NOT IN :usedIds " +
            "AND (:#{#contextSources} IS NULL OR e.contextSource IN :contextSources) " +
            "ORDER BY FUNCTION('RANDOM')")
    List<VocabularyEntry> findRandomRemaining(@Param("usedIds") List<Long> usedIds,
                                              @Param("contextSources") List<ContextSource> contextSources,
                                              Pageable pageable);
}
