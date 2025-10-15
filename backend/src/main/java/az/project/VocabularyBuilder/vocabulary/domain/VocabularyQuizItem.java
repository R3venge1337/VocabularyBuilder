package az.project.VocabularyBuilder.vocabulary.domain;

import az.project.VocabularyBuilder.common.AbstractEntityId;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldNameConstants;

@Entity
@Table(name = "vocabulary_quiz_item")
@Getter
@Setter
@FieldNameConstants
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
class VocabularyQuizItem extends AbstractEntityId {

    // Wiele szczegółów pytań do jednej sesji quizu (Many-to-One)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vocabulary_quiz_id", nullable = false) // Zmieniony klucz obcy
    private VocabularyQuiz vocabularyQuiz; // Zmieniona nazwa pola

    // Klucz obcy do słówka, które było przedmiotem testu
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vocabulary_entry_id", nullable = false)
    private VocabularyEntry vocabularyEntry;

    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect;

    @Column(name = "user_answer")
    private String userAnswer;

    @Column(name = "correct_answer", nullable = false)
    private String correctAnswer;
}
