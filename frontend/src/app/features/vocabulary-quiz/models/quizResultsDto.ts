export interface QuizItemResultDto {
  entryId: number; 
  userAnswer: string | null; 
}
export interface QuizResultsDto {
  quizUuid: string;
  durationSeconds: number;
  results: QuizItemResultDto[]; 
}
