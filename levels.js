import { QuizLevel } from './QuizLevel.js';

export function createLevels({ setFeedback, advanceLevel }) {
  return [
    new QuizLevel({
      question: "What is 2 + 2?",
      options: ["3", "4", "5"],
      correctIndex: 1,
      onComplete: (wasCorrect) => {
        if (wasCorrect) {
          setFeedback("Correct!");
          advanceLevel();
        } else {
          setFeedback("Try again!");
        }
      }
    }),
    new QuizLevel({
      question: "Calcite luster?",
      options: ["Metallic", "Non-metallic"],
      correctIndex: 1,
      onComplete: (wasCorrect) => {
        if (wasCorrect) {
          setFeedback("Correct!");
          advanceLevel();
        } else {
          setFeedback("Try again!");
        }
      }
    }),
    new QuizLevel({
      question: "Quartz hardness?",
      options: ["3", "6", "7"],
      correctIndex: 2,
      onComplete: (wasCorrect) => {
        if (wasCorrect) {
          setFeedback("Correct!");
          advanceLevel();
        } else {
          setFeedback("Try again!");
        }
      }
    }),
    new QuizLevel({
      question: "Cleaves?",
      options: ["Mica", "Garnet", "Sulfur"],
      correctIndex: 0,
      onComplete: (wasCorrect) => {
        if (wasCorrect) {
          setFeedback("Correct!");
          advanceLevel();
        } else {
          setFeedback("Try again!");
        }
      }
    }),
  ];
}