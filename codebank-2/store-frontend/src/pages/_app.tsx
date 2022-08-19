import { Box, Container, CssBaseline, MuiThemeProvider } from '@material-ui/core'
import type { AppProps } from 'next/app'
import { theme } from '../theme'
import { Navbar } from './components/Navbar'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline/>
      <Navbar />
      <Container>
        <Box marginTop={1}/>
        <Component {...pageProps} />
      </Container>
    </MuiThemeProvider>
  )
}

export default MyApp
