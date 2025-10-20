import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar-component',
  imports: [
    CommonModule, 
    RouterModule
  ],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.scss',
  standalone: true
})
export class NavbarComponent {
  navLinks = [
    { path: '/home', label: 'Home 🏠' },
    { path: '/vocabulary', label: 'Moje Słownictwo 📖' },
    { path: '/quiz', label: 'Quiz Słówek 📝' },
    { path: '/game', label: 'Tic-Tac-Toe 🎮' },
    { path: '/game/history', label: 'Historia Gier 📊' },
  ];
}
