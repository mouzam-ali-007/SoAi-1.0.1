import React, { useState } from 'react'
import MinimizeIcon from '@material-ui/icons/Minimize'
import MaximizeIcon from '@material-ui/icons/CropDin'
import CloseIcon from '@material-ui/icons/Close'
function WindowOperationContainer() {
  const [view, setView] = useState()
  const [max, setMax] = useState(false)
  React.useEffect(() => {
    setView(getContext)
    console.log('In sign in context', getContext())
  }, [])
  const getContext = () => {
    const context = global.location.search
    return context.substr(1, context.length - 1)
  }
  function minimizeWindow() {
    const remote = window.require ? window.require('electron').remote : null
    const WIN = remote.getCurrentWindow()
    WIN.minimize()
  }
  function maximizeWindow() {
    const remote = window.require ? window.require('electron').remote : null
    const WIN = remote.getCurrentWindow()
    if (!max) {
      WIN.maximize()
      setMax(!max)
    } else {
      WIN.unmaximize()
      setMax(!max)
    }
  }
  function closeWindow() {
    const remote = window.require ? window.require('electron').remote : null
    const WIN = remote.getCurrentWindow()
    WIN.hide()
  }
  return (
    <div className='Window-operations-container'>
      {view === 'snip' ? (
        <div></div>
      ) : (
        <>
          <div className='align-title'> So.Ai </div>
          <MinimizeIcon
            className='minimize'
            style={{ fontSize: 30 }}
            onClick={minimizeWindow}
          />
          {/* <MaximizeIcon
            className='minimize'
            style={{ fontSize: 30 }}
            onClick={maximizeWindow}
          /> */}
          <CloseIcon
            className='close'
            style={{ fontSize: 30 }}
            onClick={closeWindow}
          />
        </>
      )}
    </div>
  )
}
export default WindowOperationContainer
