import { Component } from '@angular/core';

@Component({
  selector: 'app-footer-component',
  imports: [],
  templateUrl: './footer-component.html',
  styleUrl: './footer-component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  appName = 'Vocabulary & Games Hub';
  developer = 'AZ';
}
