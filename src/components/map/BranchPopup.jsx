import React from 'react'
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
        type: {properties['CB Type']} <br />
        {properties['CB Node 1']} - {properties['CB Node 2']}
      </div>
    </Popup>
  )
}

export default BranchPopup
