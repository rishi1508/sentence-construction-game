import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, Flex, Text, useColorModeValue, useBreakpointValue } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '../types';
import useGameStore from '../store/gameStore';

interface Props {
    question: Question;
}

interface SelectedWordInfo {
    word: string;
}

export const SentenceQuestion: React.FC<Props> = ({ question }) => {
    const { 
        answers, 
        setAnswer, 
        timeRemaining, 
        updateTimer, 
        nextQuestion, 
        questions,
        currentQuestion,
        completeGame
    } = useGameStore();
    
    const [selectedWord, setSelectedWord] = useState<SelectedWordInfo | null>(null);
    const blankRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const currentAnswers = Array.from(answers.get(question.id) || []);
    const isLastQuestion = currentQuestion === questions.length - 1;
    const areAllBlanksFilled = currentAnswers.length === question.blanks;
    
    // Responsive styling
    const fontSize = useBreakpointValue({ base: "sm", md: "md", lg: "lg" });
    const buttonSize = useBreakpointValue({ base: "sm", md: "md" });
    const gapSize = useBreakpointValue({ base: 1, md: 2, lg: 3 });
    const padding = useBreakpointValue({ base: 3, md: 6 });
    const minHeight = useBreakpointValue({ base: "300px", md: "400px" });
    const buttonMinW = useBreakpointValue({ base: "80px", md: "100px" });
    
    const bgColor = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const textColor = useColorModeValue('gray.800', 'white');

    const containerRef = useRef<HTMLDivElement>(null);

    // Parse the sentence by splitting at the blank placeholders (_____________)
    const sentenceParts = question.sentence.split(/_{2,}/);

    useEffect(() => {
        const timer = setInterval(() => {
            if (timeRemaining > 0) {
                updateTimer();
            } else {
                if (isLastQuestion) {
                    completeGame();
                } else {
                    nextQuestion();
                }
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining, updateTimer, nextQuestion, isLastQuestion, completeGame]);

    const handleWordClick = async (word: string) => {
        if (currentAnswers.includes(word) || selectedWord) {
            return;
        }

        const targetBlank = blankRefs.current[currentAnswers.length];
        if (!targetBlank) return;

        setSelectedWord({ word });

        if (currentAnswers.length < question.blanks) {
            const newAnswers = [...currentAnswers, word];
            setTimeout(() => {
                setAnswer(question.id, newAnswers);
                setSelectedWord(null);
            }, 300);
        }
    };

    const handleBlankClick = (index: number) => {
        if (!currentAnswers[index]) return;
        const newAnswers = currentAnswers.filter((_, i) => i !== index);
        setAnswer(question.id, newAnswers);
    };

    const handleNext = () => {
        if (isLastQuestion) {
            completeGame();
        } else {
            nextQuestion();
        }
    };

    return (
        <Box 
            w="100%" 
            p={padding} 
            borderRadius="lg" 
            bg={bgColor}
            borderWidth="1px"
            borderColor={borderColor}
            shadow="md"
            position="relative"
            ref={containerRef}
            mx="auto"
            maxW="100%"
            minH={minHeight}
        >
            <Box position="relative" w="100%" h="100%">
                <Flex direction="column" align="center" gap={gapSize} w="100%" position="relative">
                    <Text 
                        fontSize={fontSize} 
                        color={timeRemaining <= 10 ? "red.500" : "blue.500"}
                        fontWeight="bold"
                    >
                        Time remaining: {timeRemaining}s
                    </Text>
                    
                    <Box w="100%" position="relative">
                        <Flex 
                            wrap="wrap" 
                            justify="center" 
                            gap={gapSize} 
                            mb={4}
                            position="relative"
                            zIndex={1}
                        >
                            {sentenceParts.map((part, i) => (
                                <React.Fragment key={i}>
                                    <Text color={textColor} fontSize={fontSize}>{part}</Text>
                                    {i < sentenceParts.length - 1 && (
                                        <Box
                                            as="span"
                                            display="inline-block"
                                        >
                                            <AnimatePresence>
                                                <motion.div
                                                    initial={{ scale: currentAnswers[i] ? 1 : 0.5, opacity: currentAnswers[i] ? 1 : 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
                                                >
                                                    <Button
                                                        ref={(el: HTMLButtonElement | null) => {
                                                            if (el) blankRefs.current[i] = el;
                                                        }}
                                                        variant={currentAnswers[i] ? "solid" : "outline"}
                                                        onClick={() => handleBlankClick(i)}
                                                        colorScheme="teal"
                                                        minW={buttonMinW}
                                                        h="40px"
                                                        size={buttonSize}
                                                    >
                                                        {currentAnswers[i] || '_____'}
                                                    </Button>
                                                </motion.div>
                                            </AnimatePresence>
                                        </Box>
                                    )}
                                </React.Fragment>
                            ))}
                        </Flex>

                        <Box position="relative">
                            <Flex 
                                wrap="wrap" 
                                justify="center" 
                                gap={gapSize} 
                                mt={6}
                                position="relative"
                                zIndex={1}
                            >
                                {question.words.map((word) => (
                                    !currentAnswers.includes(word) && (
                                        <AnimatePresence key={word}>
                                            <motion.div
                                                initial={{ scale: 1, opacity: 1 }}
                                                animate={selectedWord?.word === word ? 
                                                    { scale: 0, opacity: 0 } : 
                                                    { scale: 1, opacity: 1 }
                                                }
                                                exit={{ scale: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                            >
                                                <Button
                                                    onClick={() => handleWordClick(word)}
                                                    colorScheme="blue"
                                                    variant="outline"
                                                    size={buttonSize}
                                                >
                                                    {word}
                                                </Button>
                                            </motion.div>
                                        </AnimatePresence>
                                    )
                                ))}
                            </Flex>
                        </Box>
                    </Box>

                    {areAllBlanksFilled && (
                        <Button
                            colorScheme="green"
                            onClick={handleNext}
                            size={buttonSize}
                            mt={2}
                        >
                            {isLastQuestion ? 'Finish' : 'Next Question'}
                        </Button>
                    )}
                    
                    {currentQuestion !== null && (
                        <Text fontSize="sm" color="gray.500" mt={1}>
                            Question {currentQuestion + 1} of {questions.length}
                        </Text>
                    )}
                </Flex>
            </Box>
        </Box>
    );
};