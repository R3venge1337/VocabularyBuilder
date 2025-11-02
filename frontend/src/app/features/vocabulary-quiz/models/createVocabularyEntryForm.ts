import { PartOfSpeech } from '../../../shared/enums/partOfSpeech'
import { ContextSource } from '../../../shared/enums/contextSource'
export interface CreateVocabularyEntryForm {
  wordPhraseEn: string;
  translationPl: string;
  partOfSpeech: PartOfSpeech | null;
  contextSource: ContextSource | null; 
  sourceTitle: string | null;
  episodeNumber: number | null;
  timeOffsetSeconds: number | null;
}