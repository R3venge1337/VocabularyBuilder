package az.project.VocabularyBuilder.vocabulary.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VocabularyEntryRepository extends JpaRepository<VocabularyEntry, Long>, JpaSpecificationExecutor<VocabularyEntry> {

    @Query("SELECT v FROM VocabularyEntry v WHERE v.wordPhraseEn = :word AND v.partOfSpeech = :pos")
    Optional<VocabularyEntry> findByWordPhraseEnAndPartOfSpeech(
            @Param("word") String wordPhraseEn,
            @Param("pos") PartOfSpeech partOfSpeech
    );
}
