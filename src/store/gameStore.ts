/**
 * Game Store - Central state management for the Sentence Construction Game
 * 
 * This store handles:
 * - Game state (playing, completed)
 * - Question management
 * - Answer tracking
 * - Scoring
 * - Timer functionality
 */
import { create } from 'zustand';
import { Question } from '../types';
import { getRandomQuestions, getRandomQuestionsAsync } from '../services/questionsService';

interface GameState {
  currentQuestion: number | null;
  questions: Question[];
  score: number;
  isComplete: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  answers: Map<string, string[]>;
  timeRemaining: number;
  startGame: () => void;
  submitAnswer: (answer: string) => void;
  setQuestions: (questions: Question[]) => void;
  resetGame: () => void;
  setAnswer: (questionId: string, answers: string[]) => void;
  updateTimer: () => void;
  nextQuestion: () => void;
  completeGame: () => void;
}

// Time allowed per question (in seconds)
const INITIAL_TIME = 30;

/**
 * Calculates the total score based on correct answers
 * 
 * A correct answer means all blanks in a question are filled correctly and in the right order
 */
const calculateScore = (questions: Question[], answers: Map<string, string[]>): number => {
  return questions.reduce((score, question) => {
    const userAnswers = answers.get(question.id) || [];
    
    // An answer is correct if all words match the correct answers in order
    const isCorrect = userAnswers.length === question.correctAnswers.length &&
      userAnswers.every((answer, index) => 
        answer.toLowerCase() === question.correctAnswers[index].toLowerCase()
      );
      
    return score + (isCorrect ? 1 : 0);
  }, 0);
};

const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  currentQuestion: null,
  questions: [],
  score: 0,
  isComplete: false,
  isPlaying: false,
  isLoading: false,
  answers: new Map(),
  timeRemaining: INITIAL_TIME,
  
  // Start a new game session
  startGame: () => {
    set({ isLoading: true });
    
    // Get 10 random questions from the API
    getRandomQuestionsAsync(10)
      .then(questions => {
        set({ 
          currentQuestion: 0, 
          score: 0, 
          isComplete: false, 
          isPlaying: true, 
          isLoading: false,
          questions: questions,
          answers: new Map(),
          timeRemaining: INITIAL_TIME
        });
      })
      .catch(error => {
        console.error("Failed to load questions from API:", error);
        // Fallback to local questions if API fails
        const randomQuestions = getRandomQuestions(10);
        set({ 
          currentQuestion: 0, 
          score: 0, 
          isComplete: false, 
          isPlaying: true, 
          isLoading: false,
          questions: randomQuestions,
          answers: new Map(),
          timeRemaining: INITIAL_TIME
        });
      });
  },
  
  // Submit a single answer for the current question
  submitAnswer: (answer) => {
    const { currentQuestion, questions, answers } = get();
    if (currentQuestion === null) return;

    const question = questions[currentQuestion];
    const currentAnswers = answers.get(question.id) || [];
    const updatedAnswers = new Map(answers);
    updatedAnswers.set(question.id, [...currentAnswers, answer]);

    // Calculate new score based on all completed questions
    const newScore = calculateScore(questions, updatedAnswers);

    set({ 
      score: newScore,
      answers: updatedAnswers
    });
  },
  
  // Set all questions (used when loading from external source)
  setQuestions: (questions: Question[]) => set({ questions }),
  
  // Reset the game to initial state
  resetGame: () => set({ 
    currentQuestion: null, 
    score: 0, 
    isComplete: false, 
    isPlaying: false,
    isLoading: false,
    answers: new Map(),
    timeRemaining: INITIAL_TIME
  }),
  
  // Set all answers for a question at once
  setAnswer: (questionId: string, answers: string[]) => {
    const { answers: currentAnswers, questions } = get();
    const updatedAnswers = new Map(currentAnswers);
    updatedAnswers.set(questionId, answers);

    // Recalculate score whenever answers change
    const newScore = calculateScore(questions, updatedAnswers);

    set({ 
      answers: updatedAnswers,
      score: newScore
    });
  },
  
  // Countdown timer update (called every second)
  updateTimer: () => {
    const { timeRemaining } = get();
    if (timeRemaining > 0) {
      set({ timeRemaining: timeRemaining - 1 });
    }
  },
  
  // Move to the next question
  nextQuestion: () => {
    const { currentQuestion, questions, answers } = get();
    if (currentQuestion === null) return;
    
    const nextQuestionIndex = currentQuestion + 1;
    
    // Check if we still have questions to show
    if (nextQuestionIndex < questions.length) {
      set({ 
        currentQuestion: nextQuestionIndex,
        timeRemaining: INITIAL_TIME,
        // Update score before moving to next question
        score: calculateScore(questions, answers)
      });
    }
  },
  
  // End the game and show results
  completeGame: () => {
    const { questions, answers } = get();
    set({ 
      isComplete: true,
      isPlaying: false,
      // Ensure final score is calculated
      score: calculateScore(questions, answers)
    });
  }
}));

export default useGameStore;