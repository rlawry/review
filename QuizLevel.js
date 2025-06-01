import { CanvasButton } from './CanvasButton.js';
import { InputManager } from './inputManager.js';

export class QuizLevel {
  constructor({ question, options, correctIndex, onComplete }) {
    this.question = question;
    this.options = options;
    this.correctIndex = correctIndex;
    this.onComplete = onComplete;
    this.buttons = [];
  }

  load() {
    InputManager.clear();
    this.options.forEach((label, i) => {
      const isCorrect = i === this.correctIndex;
      const btn = new CanvasButton({
        x: 100,
        y: 150 + i * 70,
        w: 200,
        h: 50,
        label,
        correct: isCorrect,
        onClick: () => {
          this.onComplete?.(isCorrect);
        }
      });
      this.buttons.push(btn);
      InputManager.register(btn);
    });
  }

  update(dt) {
    this.buttons.forEach(btn => btn.update(dt));
  }

  draw(ctx) {
    ctx.fillStyle = 'white';
    ctx.font = '24px sans-serif';
    ctx.fillText(this.question, 100, 100);
    this.buttons.forEach(btn => btn.draw(ctx));
  }
}