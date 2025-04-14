import { Box, Button, Container, Flex, Link, Text, Center, VStack, useBreakpointValue } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { ThemeToggle } from './components/ThemeToggle'
import { ResultsScreen } from './components/ResultsScreen'
import { SentenceQuestion } from './components/SentenceQuestion'
import useGameStore from './store/gameStore'

function App() {
  const { currentQuestion, isComplete, isPlaying } = useGameStore()
  const { startGame, resetGame } = useGameStore()
  
  // Move ALL responsive breakpoint hooks to the top level
  // to ensure they're called in the same order on every render
  const containerWidth = useBreakpointValue({ base: "95%", md: "90%", lg: "container.md" })
  const paddingY = useBreakpointValue({ base: 4, md: 8 })
  const headingSize = useBreakpointValue({ base: "2xl", md: "3xl", lg: "4xl" })
  const buttonSizeSmall = useBreakpointValue({ base: "xs", md: "sm" })
  const buttonSizeMedium = useBreakpointValue({ base: "sm", md: "md" })
  const buttonSizeLarge = useBreakpointValue({ base: "md", md: "lg" })
  const textSize = useBreakpointValue({ base: "md", md: "lg" })
  const paddingX = useBreakpointValue({ base: 2, md: 0 })
  const footerPadding = useBreakpointValue({ base: 3, md: 4 })
  
  // Handle quit game
  const handleQuit = () => {
    resetGame();
  }

  return (
    <Container maxW={containerWidth} py={paddingY} display="flex" flexDirection="column" minH="100vh">
      <Flex justifyContent="flex-end" alignItems="center" mb={4} position="relative" zIndex="1" gap={2}>
        <ThemeToggle />
        {isPlaying && !isComplete && (
          <Button
            aria-label="Quit Game"
            variant="ghost"
            colorScheme="red"
            onClick={handleQuit}
            size={buttonSizeMedium}
            mr={2}
          >
            Quit
          </Button>
        )}
      </Flex>

      <Box textAlign="center" fontSize="xl" mb={8} flex="1">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Text fontSize={headingSize} fontWeight="bold" mb={4}>
            Sentence Construction Game
          </Text>
        </motion.div>

        {!isPlaying && !isComplete && (
          <Center h="50vh">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <VStack spacing={4} px={paddingX}>
                <Text mb={4} fontSize={textSize}>
                  Test your language skills by arranging words in the correct order to form proper sentences.
                </Text>
                <Button
                  colorScheme="blue"
                  size={buttonSizeLarge}
                  onClick={startGame}
                >
                  Play
                </Button>
              </VStack>
            </motion.div>
          </Center>
        )}

        {isPlaying && currentQuestion !== null && !isComplete && (
          <SentenceQuestion question={useGameStore.getState().questions[currentQuestion]} />
        )}

        {isComplete && (
          <ResultsScreen />
        )}
      </Box>

      <Flex 
        as="footer" 
        justifyContent="center" 
        alignItems="center" 
        py={footerPadding} 
        gap={2}
        borderTop="1px solid"
        borderColor="gray.200"
        mt={4}
        position="fixed"
        bottom="0"
        left="0"
        width="100%"
        bg="white"
        _dark={{
          bg: "gray.900",
          borderColor: "gray.700"
        }}
        zIndex="docked"
        fontSize={buttonSizeSmall}
      >
        <Text>Made with ❤️ by Rishi Mishra</Text>
        <Link href="https://www.linkedin.com/in/rishimishra1508" isExternal>
          <Button
            variant="ghost"
            size={buttonSizeSmall}
            aria-label="LinkedIn"
            p={1}
            minW={8}
          >
            {FaLinkedin({})}
          </Button>
        </Link>
        <Link href="https://www.github.com/rishi1508" isExternal>
          <Button
            variant="ghost"
            size={buttonSizeSmall}
            aria-label="GitHub"
            p={1}
            minW={8}
          >
            {FaGithub({})}
          </Button>
        </Link>
      </Flex>
    </Container>
  )
}

export default App
