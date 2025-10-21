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
        path: '', 
        redirectTo: 'home', 
        pathMatch: 'full' 
    },
    { path: '**', redirectTo: 'home' }
];
