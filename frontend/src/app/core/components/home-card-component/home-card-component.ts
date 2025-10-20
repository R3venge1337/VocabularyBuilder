import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-card-component',
  imports: [ 
    RouterLink,       
    MatCardModule,     
    MatButtonModule],
  templateUrl: './home-card-component.html',
  styleUrl: './home-card-component.scss'
})
export class HomeCardComponent {
  featureCards = [
    { title: 'Quiz Słówek', description: 'Buduj słownictwo, dodawaj nowe wyrazy i sprawdzaj swoją wiedzę w dynamicznym quizie.', path: '/quiz', icon: '📝' },
    { title: 'Tic-Tac-Toe', description: 'Graj w klasyczną grę przeciwko sztucznej inteligencji, a Twoje wyniki zostaną zapisane w Historii Gier.', path: '/game', icon: '🎮' },
    { title: 'Moja Historia', description: 'Śledź swoje postępy w nauce słówek i statystyki gier w jednym miejscu.', path: '/history', icon: '📈' },
  ];

}
