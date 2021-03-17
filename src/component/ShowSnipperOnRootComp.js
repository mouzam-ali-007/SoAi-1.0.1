import React from 'react'
import Snipper from './Snipper'
import { useHistory } from 'react-router-dom'

import Modal from 'react-modal'
import '../assets/css/modal.css'
const remote = window.require('electron').remote
const settings = remote.require('electron-settings')
const Capture = async (b64) => {
  const name = 'artifact' + Math.random().toString(36).substring(5) + '.png'

  settings.setSync('captured', {
    image: b64,
  })
}
function ShowSnipperOnRootComp() {
  const [showModal, setShowModal] = React.useState(true)
  const history = useHistory()

  return (
    <div>
      <Modal
        style={{
          overlay: {
            backgroundColor: 'rgb(1,1,1,0.3)',
          },
          content: {
            backgroundColor: 'rgb(33, 35, 33)',
            borderRadius: '50px 50px 50px 50px',
            marginTop: '130px',
          },
        }}
        id='modal'
        isOpen={showModal}
        onRequestClose={() => {
          setShowModal(false)
          history.push('/transaction')
        }}
      >
        <Snipper
          setImageFromSnipper={(data) => {}}
          setImageState={(data) => {}}
          setShowModal={setShowModal}
          setShowCropper={(data) => {
            console.log(
              'Set show cropper recieved : expected value{false} : recieved',
              data
            )
            if (!data) {
              history.push('/transaction')
            }
          }}
          Capture={Capture}
        />
      </Modal>
    </div>
  )
}

export default ShowSnipperOnRootComp
