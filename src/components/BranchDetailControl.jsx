import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  // ListItemSecondaryAction,
  Checkbox,
  Button
} from '@material-ui/core'

import { showTable, selectZone } from '../slices/branchDetailSlice'

const useStyles = makeStyles({
  checkBox: {
    padding: '3px 9px'
  }
})

const BranchDetailControl = ({ options, showTable, isTableVisible, selectZone }) => {
  const classes = useStyles()
  const [checked, setChecked] = React.useState([])

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
    selectZone(newChecked)
  }

  return (
    <div>
      <List
        disablePadding
        subheader={
          <ListSubheader component='div' id='nested-list-subheader'>
            Select flow type
          </ListSubheader>
        }
      >
        {options.map(option => (
          <ListItem
            key={option}
            role={undefined}
            dense
            button
            onClick={handleToggle(option)}
          >
            <ListItemIcon>
              <Checkbox
                edge='start'
                checked={checked.indexOf(option) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': `checkbox-list-label-${option}` }}
                className={classes.checkBox}
              />
            </ListItemIcon>
            <ListItemText
              id={`checkbox-list-label-${option}`}
              primary={option.replace(' [MW]', '')}
            />
          </ListItem>
        ))}
      </List>
      <Button variant='outlined' onClick={() => showTable()}>
        {isTableVisible ? 'Hide table' : 'Show branch table'}
      </Button>
    </div>
  )
}

function mapStateToProps({ branchDetailSlice }) {
  return {
    options: branchDetailSlice.columns,
    isTableVisible: branchDetailSlice.isTableVisible
  }
}

export default connect(mapStateToProps, { showTable, selectZone })(BranchDetailControl)

BranchDetailControl.propTypes = {
  options: PropTypes.array.isRequired,
  isTableVisible: PropTypes.bool.isRequired,
  showTable: PropTypes.func.isRequired,
  selectZone: PropTypes.func.isRequired
}
