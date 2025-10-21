import { ContextSource } from "../../../shared/enums/contextSource";
import { MasteryStatus } from "../../../shared/enums/masterStatus";
import { PartOfSpeech } from "../../../shared/enums/partOfSpeech";

export interface FilterVocabularyEntryForm {
  word: string;
  masteryStatus: MasteryStatus | null;
  partOfSpeech: PartOfSpeech | null;
  contextSource: ContextSource | null;
}