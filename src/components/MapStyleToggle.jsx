import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Fab, Button } from '@material-ui/core'
import MapOutlinedIcon from '@material-ui/icons/MapOutlined'
import styled from 'styled-components'
import { Transition } from 'react-transition-group'

const StyleD = styled.div`
  display: grid;
  grid-template-columns: 1;
  gap: 5px;
  padding-top: 10px;
  transition: 200ms;
  display: ${({ state }) => (state === 'exited' ? 'none' : 'grid')};
  button {
    transition: 300ms ease;
    opacity: ${({ state }) => (state === 'entered' ? 1 : 0.01)};
  }
  button:nth-child(1) {
    transition-delay: 100ms;
  }
  button:nth-child(2) {
    transition-delay: 200ms;
  }
  button:nth-child(3) {
    transition-delay: 300ms;
  }
`

const MapStyleToggle = ({ onClick }) => {
  const [show, setShow] = useState(false)
  return (
    <>
      <Fab
        color='primary'
        size='small'
        aria-label='map style'
        onClick={() => setShow(!show)}
      >
        <MapOutlinedIcon fontSize='small' />
      </Fab>
      <Transition in={show} timeout={300} unmountOnExit>
        {state => (
          <StyleD state={state}>
            <Button
              size='small'
              variant='contained'
              color='primary'
              onClick={() => onClick('light-v10')}
            >
              light
            </Button>
            <Button
              size='small'
              variant='contained'
              color='primary'
              onClick={() => onClick('dark-v10')}
            >
              dark
            </Button>
            <Button
              size='small'
              variant='contained'
              color='primary'
              onClick={() => onClick('streets-v10')}
            >
              streets
            </Button>
          </StyleD>
        )}
      </Transition>
    </>
  )
}

export default MapStyleToggle

MapStyleToggle.propTypes = {
  onClick: PropTypes.func.isRequired
}
