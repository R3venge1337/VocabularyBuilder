import { ContextSource } from "../../../shared/enums/contextSource";
import { MasteryStatus } from "../../../shared/enums/masterStatus";
import { PartOfSpeech } from "../../../shared/enums/partOfSpeech";

export interface VocabularyEntryView {
  id: number; // Zmienione z Long na number dla JavaScript
  wordPhraseEn: string;
  translationPl: string;
  partOfSpeech: PartOfSpeech;
  masteryStatus: MasteryStatus;
  contextSource: ContextSource;
  correctAnswerStreak: number; // Zmienione z Integer na number
  totalCorrectAnswers: number; // Zmienione z Integer na number
  createdAt: Date; // Zmienione z LocalDateTime na Date
  sourceTitle: string;
  episodeNumber: number | null;
  timeOffsetSeconds: number | null;
  imageUrl: string | null;
}