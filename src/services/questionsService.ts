/**
 * Question Service - Provides access to question data
 * 
 * This service handles fetching question data from either:
 * 1. Local JSON file (offline mode)
 * 2. Remote JSON server (if available)
 */
import sampleData from '../store/sample.json';
import { Question } from '../types';

const API_BASE_URL = 'http://localhost:3000';

/** 
 * Fetch questions from the JSON Server API
 */
export async function fetchQuestions(): Promise<Question[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/questions`);
        if (!response.ok) throw new Error("Error fetching questions");
        
        const questions = await response.json();
        
        // Transform questions from the API format to our Question format
        return questions.map((q: any) => ({
            id: q.id,
            sentence: q.sentence,
            words: q.options || [],
            correctAnswers: q.correctAnswers || [],
            blanks: q.correctAnswers ? q.correctAnswers.length : 0
        }));
    } catch (err) {
        console.error("Questions fetch failed:", err);
        // Fall back to local data if API fails
        return getQuestionsFromLocal();
    }
}

/** 
 * Fetch status information from the server
 */
export async function fetchStatus(): Promise<any> {
    try {
        const response = await fetch("http://localhost:3001/status");
        if (!response.ok) throw new Error("Error fetching status");
        return response.json();
    } catch (err) {
        console.error("Server status check failed:", err);
        throw err;
    }
}

/**
 * Fetch question data from the server
 */
export async function fetchData(): Promise<any> {
    try {
        const response = await fetch("http://localhost:3001/data");
        if (!response.ok) throw new Error("Error fetching data");
        return response.json();
    } catch (err) {
        console.error("Data fetch failed:", err);
        // If server fetch fails, we could fall back to local data
        return { data: sampleData.data }; 
    }
}

/**
 * Get questions from the API and transform them to our Question format
 * Falls back to local data if the API request fails
 */
export async function getQuestionsFromAPI(): Promise<Question[]> {
    try {
        const data = await fetchData();
        
        // Transform questions from the API format to our internal Question format
        const questions = data.data.questions.map((q: any) => ({
            id: q.questionId,
            sentence: q.question,
            words: [...q.options], // Use the options as the words
            correctAnswers: [...q.correctAnswer], // Use the correctAnswer array
            blanks: q.correctAnswer.length // Number of blanks is the length of correctAnswer array
        }));
        
        return questions;
    } catch (error) {
        console.error("Failed to get questions from API, falling back to local data:", error);
        return getQuestionsFromLocal();
    }
}

/**
 * Fetch message from the server (for notifications)
 */
export async function fetchMessage(): Promise<any> {
    try {
        const response = await fetch("http://localhost:3001/message");
        if (!response.ok) throw new Error("Error fetching message");
        return response.json();
    } catch (err) {
        console.error("Message fetch failed:", err);
        throw err;
    }
}

/**
 * Fetch user activity data from the server
 */
export async function fetchActivity(): Promise<any> {
    try {
        const response = await fetch("http://localhost:3001/activity");
        if (!response.ok) throw new Error("Error fetching activity");
        return response.json();
    } catch (err) {
        console.error("Activity fetch failed:", err);
        throw err;
    }
}

/**
 * Get questions directly from the local sample.json file
 * This is used when the server is not available
 */
export function getQuestionsFromLocal(): Question[] {
    // Transform questions from the JSON format to our internal Question format
    return sampleData.data.questions.map((q: any) => ({
        id: q.questionId,
        sentence: q.question,
        words: [...q.options], // Use the options as the words
        correctAnswers: [...q.correctAnswer], // Use the correctAnswer array
        blanks: q.correctAnswer.length // Number of blanks is the length of correctAnswer array
    }));
}

/**
 * Get a specified number of random questions
 * This function first tries to fetch from the API, falling back to local data if needed
 * 
 * @param count Number of questions to return (default: 10)
 * @returns Promise that resolves to an array of randomly selected questions
 */
export async function getRandomQuestionsAsync(count: number = 10): Promise<Question[]> {
    // Try to get questions from the API
    const allQuestions = await fetchQuestions();
    
    // Fisher-Yates shuffle algorithm
    const shuffled = [...allQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Return the first 'count' questions or all if less than count
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Get a specified number of random questions from the local data
 * This is a synchronous version that uses local data only
 * 
 * @param count Number of questions to return (default: 10)
 * @returns Array of randomly selected questions
 */
export function getRandomQuestions(count: number = 10): Question[] {
    const allQuestions = getQuestionsFromLocal();
    
    // Fisher-Yates shuffle algorithm
    const shuffled = [...allQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Return the first 'count' questions or all if less than count
    return shuffled.slice(0, Math.min(count, shuffled.length));
}