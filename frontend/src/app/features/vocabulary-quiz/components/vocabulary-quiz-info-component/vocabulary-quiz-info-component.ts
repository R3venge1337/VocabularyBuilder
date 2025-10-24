import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vocabulary-quiz-info-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './vocabulary-quiz-info-component.html',
  styleUrl: './vocabulary-quiz-info-component.scss'
})
export class VocabularyQuizInfoComponent {
  // Inputs
    maxWords = input.required<number>();
    // Outputs
    startNewQuiz = output<number | null>();

    quizLength: number | null = 1;

    isInputValid = computed(() => {
        if (this.quizLength === null || typeof this.quizLength !== 'number') return false;
        const length = Math.floor(this.quizLength);
        return length > 0 && length <= this.maxWords();
    });

    onLengthChange(newVal: number | null) {
        if (newVal !== null) {
            this.quizLength = Math.max(1, Math.min(this.maxWords(), Math.floor(newVal)));
        }
    }
}
