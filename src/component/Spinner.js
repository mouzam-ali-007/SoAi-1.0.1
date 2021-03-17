import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

const Spinner = ({ size }) => {
  return <CircularProgress size={size ? size : 20} />
}

export default Spinner
