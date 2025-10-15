package az.project.VocabularyBuilder.vocabulary.domain;

import az.project.VocabularyBuilder.common.AbstractEntityId;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldNameConstants;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "vocabulary_quiz")
@Getter
@Setter
@FieldNameConstants
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
class VocabularyQuiz extends AbstractEntityId {

    @Column(name = "quiz_uuid", updatable = false, nullable = false)
    private UUID quizUuid = UUID.randomUUID();

    // Relacja One-to-Many do szczegółów pytań
    @OneToMany(mappedBy = "vocabularyQuiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<VocabularyQuizItem> quizItems; // Zmieniona nazwa kolekcji

    @Column(name = "score_correct", nullable = false)
    private Integer scoreCorrect;

    @Column(name = "score_total", nullable = false)
    private Integer scoreTotal;

    @Column(name = "accuracy_percent", precision = 5, scale = 2, nullable = false)
    private BigDecimal accuracyPercent;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Column(name = "date_completed", nullable = false)
    private LocalDateTime dateCompleted = LocalDateTime.now();
}
