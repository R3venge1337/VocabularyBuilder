package az.project.VocabularyBuilder.vocabulary.domain;

import az.project.VocabularyBuilder.common.AbstractEntityId;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldNameConstants;

import java.time.LocalDateTime;

@Entity
@Table(name = "vocabulary_entries")
@Getter
@Setter
@FieldNameConstants
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VocabularyEntry extends AbstractEntityId {

    @Column(name = "word_phrase_en", nullable = false)
    private String wordPhraseEn;

    @Column(name = "translation_pl", nullable = false)
    private String translationPl;

    @Enumerated(EnumType.STRING)
    @Column(name = "part_of_speech", nullable = false)
    private PartOfSpeech partOfSpeech;

    @Enumerated(EnumType.STRING)
    @Column(name = "mastery_status", nullable = false)
    private MasteryStatus masteryStatus = MasteryStatus.LEARNING;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "context_source", nullable = false)
    private ContextSource contextSource;

    @Column(name = "source_title", nullable = true)
    private String sourceTitle;

    @Column(name = "episode_number", nullable = true)
    private Integer episodeNumber;

    @Column(name = "time_offset_seconds", nullable = true)
    private Integer timeOffsetSeconds;

    @Column(name = "correct_answer_streak", nullable = true)
    private Integer correctAnswerStreak;

    @Column(name = "total_correct_aswers", nullable = true)
    private Integer totalCorrectAnswers;
}
