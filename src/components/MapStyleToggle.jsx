import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Fab, Button } from '@material-ui/core'
import MapOutlinedIcon from '@material-ui/icons/MapOutlined'
import styled from 'styled-components'
import { Transition } from 'react-transition-group'

import { setMapboxStyle } from 'slices/mapLookSlice'

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
const TopRight = styled.div`
  position: absolute;
  top: 25px;
  right: 25px;
  text-align: right;
`

const MapStyleToggle = ({ setMapboxStyle }) => {
  const [show, setShow] = useState(false)

  const handleClick = style => {
    setMapboxStyle(style)
    setShow(!show)
  }

  return (
    <TopRight>
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
              onClick={() => handleClick('light-v8')}
            >
              light
            </Button>
            <Button
              size='small'
              variant='contained'
              color='primary'
              onClick={() => handleClick('dark-v8')}
            >
              dark
            </Button>
            <Button
              size='small'
              variant='contained'
              color='primary'
              onClick={() => handleClick('streets-v8')}
            >
              streets
            </Button>
          </StyleD>
        )}
      </Transition>
    </TopRight>
  )
}

export default connect(null, { setMapboxStyle })(MapStyleToggle)

MapStyleToggle.propTypes = {
  setMapboxStyle: PropTypes.func.isRequired
}
