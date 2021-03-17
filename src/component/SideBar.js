import React from 'react'
import { Grid, Typography, makeStyles, Box } from '@material-ui/core'
import ExitToAppSharpIcon from '@material-ui/icons/ExitToAppSharp'
import WidgetsIcon from '@material-ui/icons/Widgets'
import SettingsIcon from '@material-ui/icons/Settings'
import CameraAltIcon from '@material-ui/icons/CameraAlt'
import { Link } from 'react-router-dom'
import { logOut } from '../helperFunctions'

const remote = window.require('electron').remote
const settings = remote.require('electron-settings')
const useStyles = makeStyles((theme) => ({
  top: {
    border: '1px solid transparent',
    borderRightColor: 'rgba(255,255,255,0.12)',
    height: theme.spacing(80),
    margingTop: theme.spacing(30),
    paddingTop: theme.spacing(10),
  },
  box: {
    marginBottom: theme.spacing(-3),
    marginTop: theme.spacing(-2),
    padding: theme.spacing(1),
  },
  logOutBox: {
    padding: theme.spacing(1),
  },
  icon: {
    fontSize: theme.spacing(6),
    marginTop: theme.spacing(6),
    marginLeft: theme.spacing(1),
    color: 'white',
    '&:hover': {
      color: 'rgba(255,255,255,0.12)',
    },
  },
  heading: {
    color: 'white',
    textDecoration: 'none',
    fontSize: theme.spacing(2),
  },
}))

export default function SideBar() {
  const classes = useStyles()

  return (
    <Grid item xs={1} alignCotent='center' className={classes.top}>
      <Link to='/test' style={{ textDecoration: 'none' }}>
        <Box className={classes.box}>
          <CameraAltIcon
            color='secondary'
            size='large'
            className={classes.icon}
          />
          {/* <Typography
            variant='label'
            className={classes.heading}
            style={{ marginLeft: '10px' }}
          >
            Model
          </Typography> */}
        </Box>
      </Link>
      <Link to='/transaction' style={{ textDecoration: 'none' }}>
        <Box className={classes.box}>
          <WidgetsIcon
            color='secondary'
            size='large'
            className={classes.icon}
          />
          {/* <Typography
            variant='label'
            className={classes.heading}
            style={{ marginLeft: '10px' }}
          >
            Model
          </Typography> */}
        </Box>
      </Link>
      <Link to='/settings' style={{ textDecoration: 'none' }}>
        <Box className={classes.box}>
          <SettingsIcon
            color='secondary'
            size='large'
            className={classes.icon}
          />
          {/* <Typography
            variant='label'
            className={classes.heading}
            style={{ marginLeft: '5px' }}
          >
            Settings
          </Typography> */}
        </Box>
      </Link>

      <Link
        to='/'
        onClick={() => {
          settings.setSync('user-login-data', {})
          logOut()
        }}
        style={{ textDecoration: 'none' }}
      >
        <Box className={classes.logOutBox}>
          <ExitToAppSharpIcon
            color='secondary'
            size='large'
            className={classes.icon}
          />
        </Box>
        {/* <Typography
          variant='label'
          className={classes.heading}
          style={{ marginLeft: '10px' }}
        >
          Log Out
        </Typography> */}
      </Link>
    </Grid>
  )
}
