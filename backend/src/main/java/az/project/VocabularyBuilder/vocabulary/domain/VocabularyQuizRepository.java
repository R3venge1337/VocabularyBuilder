package az.project.VocabularyBuilder.vocabulary.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VocabularyQuizRepository extends JpaRepository<VocabularyQuiz, Long> {
}
