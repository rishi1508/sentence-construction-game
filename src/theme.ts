import { extendTheme, type ThemeConfig, type StyleFunctionProps } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  fonts: {
    heading: "'Poppins', sans-serif",
    body: "'Roboto', sans-serif",
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      'html, body': {
        backgroundColor: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
        fontFamily: "'Roboto', sans-serif",
      },
      '#root': {
        backgroundColor: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
      h1: {
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 700,
      },
      h2: {
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 600,
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontFamily: "'Poppins', sans-serif",
        fontWeight: '600',
        _hover: {
          transform: 'scale(1.05)',
        },
        transition: 'all 0.2s ease-in-out',
      },
    },
    Heading: {
      baseStyle: {
        fontFamily: "'Poppins', sans-serif",
        fontWeight: '700',
      },
    },
  },
})

export default theme