import { PartOfSpeech } from '../../../shared/enums/partOfSpeech'
import { ContextSource } from '../../../shared/enums/contextSource'
export interface CreateVocabularyEntryForm {
  wordPhraseEn: string;
  translationPl: string;
  partOfSpeech: PartOfSpeech | null; // Null, dopóki użytkownik nie wybierze
  contextSource: ContextSource | null; // Null, dopóki użytkownik nie wybierze
  sourceTitle: string;
  episodeNumber: number | null;
  timeOffsetSeconds: number | null;
}