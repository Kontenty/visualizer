import React from 'react'
import PropTypes from 'prop-types'
import { Popup } from 'react-map-gl'

const BranchPopup = ({ popupInfo, onClose }) => {
  const { properties } = popupInfo

  return (
    <Popup
      longitude={popupInfo.lngLat[0]}
      latitude={popupInfo.lngLat[1]}
      onClose={() => onClose()}
    >
      <div>
        Branch: {properties.CB_NAME} <br />
        F-max: {properties.F_MAX} <br />
        {properties.CB_FROM} - {properties.CB_TO}
      </div>
    </Popup>
  )
}

export default BranchPopup

BranchPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  popupInfo: PropTypes.object.isRequired
}
