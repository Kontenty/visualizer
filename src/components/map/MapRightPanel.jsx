import React from 'react'
import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar'
import Chip from '@material-ui/core/Chip'

import RightBar from 'components/RightBar'
import Table from 'components/TableSortable'

const MapRightPanel = ({ popupInfo, isOpen, close }) => {
  const { totalFlow } = popupInfo || 0

  return (
    <RightBar isOpen={isOpen} close={close}>
      {popupInfo && (
        <>
          <div style={{ margin: '3px 2px' }}>
            <Chip
              avatar={<Avatar>B</Avatar>}
              label={`branch: ${popupInfo.properties.CB_NAME}`}
              color='primary'
              // deleteIcon={<DoneIcon />}
              variant='outlined'
              style={{ marginRight: '5px' }}
            />
            <Chip
              avatar={<Avatar>T</Avatar>}
              style={{ marginRight: '5px' }}
              label={`total flow: ${
                totalFlow >= 0 ? totalFlow + ' - DIR' : -totalFlow + ' - OPP'
              }`}
              color='primary'
              // deleteIcon={<DoneIcon />}
              variant='outlined'
            />
            <Chip
              avatar={<Avatar>F</Avatar>}
              label={`Fmax: ${popupInfo.properties.F_MAX}`}
              color='primary'
              // deleteIcon={<DoneIcon />}
              variant='outlined'
            />
          </div>
          <Table
            columns={popupInfo.columns}
            rows={popupInfo.rowsForSort}
            headRow={popupInfo.headRow}
          />
        </>
      )}
    </RightBar>
  )
}

export default MapRightPanel

MapRightPanel.propTypes = {
  popupInfo: PropTypes.object.isRequired,
  isOpen: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
}
