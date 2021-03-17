import React from 'react'
import Container from '@material-ui/core/Container'
import logo from '../LOGO.png'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  header: {
    // paddinLeft:theme.spacing(2),
    paddingTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}))

export default function Header() {
  const classes = useStyles()
  return (
    <Container>
      <img
        className={classes.header}
        style={{ height: '120px' }}
        src={logo}
        alt='So.Ai'
      />
    </Container>
  )
}
