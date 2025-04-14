import React, { useEffect } from 'react';
import { Box, Text, Button, Heading, useColorModeValue, Flex, useBreakpointValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';
import { fetchData } from "../services/questionsService";

const MotionButton = motion(Button);
const MotionBox = motion(Box);

export const ResultsScreen: React.FC = () => {
    const { questions, answers, score, resetGame } = useGameStore();
    const bgColor = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const textColor = useColorModeValue('gray.800', 'white');
    
    // Responsive styles
    const fontSize = useBreakpointValue({ base: "sm", md: "md" });
    const padding = useBreakpointValue({ base: 4, md: 8 });
    const gapSize = useBreakpointValue({ base: 3, md: 6 });
    const headingSize = useBreakpointValue({ base: "md", md: "lg" });
    const scoreSize = useBreakpointValue({ base: "xl", md: "2xl" });
    const buttonSize = useBreakpointValue({ base: "md", md: "lg" });

    // Example usage of fetchData
    useEffect(() => {
        fetchData()
            .then((data: any) => console.log(data))
            .catch((error: any) => console.error("Error fetching data:", error));
    }, []);

    return (
        <Box 
            w="100%"
            mx="auto"
            maxW="100%"
        >
            <Box 
                p={padding} 
                borderRadius="lg" 
                bg={bgColor}
                borderWidth="1px"
                borderColor={borderColor}
                shadow="md"
            >
                <Flex direction="column" gap={gapSize}>
                    <Heading color={textColor} size={headingSize} textAlign="center">Results</Heading>
                    <Text 
                        fontSize={scoreSize} 
                        textAlign="center" 
                        color={score > questions.length / 2 ? "green.500" : "red.500"}
                        fontWeight="bold"
                    >
                        Your Score: {score} out of {questions.length}
                    </Text>

                    <Box display="flex" flexDirection="column" gap={gapSize}>
                        {questions.map((question, index) => {
                            const userAnswers = answers.get(question.id) || [];
                            const isCorrect = JSON.stringify(userAnswers) === JSON.stringify(question.correctAnswers);

                            return (
                                <MotionBox
                                    key={question.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    p={padding}
                                    borderWidth="1px"
                                    borderRadius="md"
                                    borderColor={isCorrect ? "green.200" : "red.200"}
                                    bg={useColorModeValue(
                                        isCorrect ? 'green.50' : 'red.50',
                                        isCorrect ? 'green.900' : 'red.900'
                                    )}
                                >
                                    <Text 
                                        color={isCorrect ? "green.500" : "red.500"} 
                                        fontWeight="bold" 
                                        mb={2}
                                        fontSize={fontSize}
                                    >
                                        Question {index + 1}: {isCorrect ? "Correct" : "Incorrect"}
                                    </Text>
                                    <Text color={textColor} mb={2} fontSize={fontSize}>
                                        Original sentence: {question.sentence}
                                    </Text>
                                    <Text color={textColor} mb={2} fontSize={fontSize}>
                                        Your answer: {userAnswers.join(', ') || 'No answer provided'}
                                    </Text>
                                    {!isCorrect && (
                                        <Text color="green.500" fontSize={fontSize}>
                                            Correct answer: {question.correctAnswers.join(', ')}
                                        </Text>
                                    )}
                                </MotionBox>
                            );
                        })}
                    </Box>

                    <MotionButton
                        colorScheme="blue"
                        onClick={resetGame}
                        size={buttonSize}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        alignSelf="center"
                    >
                        Try Again
                    </MotionButton>
                </Flex>
            </Box>
        </Box>
    );
};