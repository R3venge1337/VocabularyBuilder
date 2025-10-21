import { ContextSource } from "../../../shared/enums/contextSource";
import { PartOfSpeech } from "../../../shared/enums/partOfSpeech";

export interface UpdateVocabularyEntryForm {
  wordPhraseEn: string;
  translationPl: string;
  partOfSpeech: PartOfSpeech | null;
  contextSource: ContextSource | null;
  sourceTitle: string;
  episodeNumber: number | null;
  timeOffsetSeconds: number | null;
}