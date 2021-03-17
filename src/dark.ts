// creating a dark theme from material ui
import { createMuiTheme } from '@material-ui/core'
import grey from '@material-ui/core/colors/grey'
export const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    text: {
      primary: '#fff',
    },
    background: {
      default: 'rgba(0,0,0 , 0.93)',
    },
    primary: {
      main: grey[100],
    },
    secondary: {
      main: 'rgba(255,255,255,0.12)',
    },
  },
})
