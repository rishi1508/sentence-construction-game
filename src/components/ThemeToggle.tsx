import { Box, useColorMode } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaSun, FaMoon } from 'react-icons/fa'

const MotionBox = motion(Box)

export const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  
  return (
    <Box
      position="fixed"
      top="4"
      right="4"
      zIndex="overlay"
    >
      <Box
        as="button"
        onClick={toggleColorMode}
        bg={colorMode === 'light' ? 'gray.200' : 'gray.700'}
        p="2px"
        w="70px"
        h="34px"
        borderRadius="full"
        position="relative"
        transition="all 0.2s ease-in-out"
        display="flex"
        alignItems="center"
        _hover={{ 
          opacity: 0.9,
          transform: 'scale(1.05)'
        }}
        boxShadow="md"
        border="1px solid"
        borderColor={colorMode === 'light' ? 'gray.300' : 'gray.600'}
      >
        <MotionBox
          initial={false}
          animate={{
            x: colorMode === 'light' ? '0px' : '36px',
          }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30 
          }}
          bg={colorMode === 'light' ? 'white' : 'gray.800'}
          w="30px"
          h="30px"
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0px 1px 2px rgba(0, 0, 0, 0.2)"
        >
          {colorMode === 'light' ? (
            FaSun({})
          ) : (
            FaMoon({})
          )}
        </MotionBox>
      </Box>
    </Box>
  )
}