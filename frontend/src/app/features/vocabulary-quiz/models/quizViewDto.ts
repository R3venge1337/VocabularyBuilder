import { MasteryStatus } from "../../../shared/enums/masterStatus";
import { PartOfSpeech } from "../../../shared/enums/partOfSpeech";

export interface QuizViewDto {
  quizUuid: string;
  scoreCorrect: number; 
  scoreTotal: number;
  accuracyPercent: number;
  durationSeconds: number;
  dateCompleted: string;
  itemResults: QuizItemView[]; 
}

export interface QuizItemView {
 
entryId: number;
  wordPhraseEn: string;
  partOfSpeech: PartOfSpeech;
  isCorrect: boolean;
  userAnswer: string | null;
  correctAnswer: string;
  finalMasteryStatus: MasteryStatus;
}
