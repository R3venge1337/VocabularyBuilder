import { Routes } from '@angular/router';

export const routes: Routes = [
    { 
        path: 'home', 
        loadComponent: () => import('./core/pages/home-page/home-page').then(m => m.HomePage)
    },
    { 
        path: 'vocabulary', 
        loadComponent: () => import('./features/vocabulary-quiz/pages/vocabulary-page/vocabulary-page').then(m => m.VocabularyPage)
    },
    {
        path: 'quiz',
        loadComponent: () => import('./features/vocabulary-quiz/pages/vocabulary-quiz-page/vocabulary-quiz-page').then(m => m.VocabularyQuizPage),
    },
    {
        path: 'tictactoe',
        loadComponent: () => import('./features/tic-tac-toe/pages/tictactoe-page/tictactoe-page').then(m => m.TictactoePage)
    },
    {
        path: 'game/history',
        loadComponent: () => import('./core/components/game-history-page/game-history-page').then(m => m.GameHistoryPage)
    },
    {
        path: 'quiz/history',
        loadComponent: () => import('./core/pages/quiz-history-page/quiz-history-page').then(m => m.QuizHistoryPage),
    },
    { 
        path: '', 
        redirectTo: 'home', 
        pathMatch: 'full' 
    },
    { path: '**', redirectTo: 'home' }
];
