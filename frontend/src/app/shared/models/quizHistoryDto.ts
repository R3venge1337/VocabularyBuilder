export interface QuizHistoryDto {

    quizUuid: string;

    scoreCorrect: number;

    scoreTotal: number;

    accuracyPercent: number;

    durationSeconds: number;

    dateCompleted: string;
}