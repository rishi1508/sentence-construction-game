export interface Question {
    id: string;
    sentence: string;
    words: string[];
    correctAnswers: string[];
    blanks: number;
}

export interface GameState {
    currentQuestion: number;
    questions: Question[];
    answers: Map<string, string[]>;
    timeRemaining: number;
    isComplete: boolean;
    score: number;
    setAnswer: (questionId: string, answers: string[]) => void;
    nextQuestion: () => void;
    updateTimer: () => void;
    completeGame: () => void;
    resetGame: () => void;
}

export interface Answer {
    questionId: string;
    userAnswer: string[];
    isCorrect: boolean;
}