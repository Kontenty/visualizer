import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  // ListItemSecondaryAction,
  Checkbox,
  Button,
  Typography
} from '@material-ui/core'

import { showTable, selectZone } from '../slices/branchDetailSlice'

const useStyles = makeStyles({
  root: {
    marginTop: '1rem'
  },
  checkBox: {
    padding: '3px 9px'
  }
})

const BranchDetailControl = ({
  branchName,
  options,
  showTable,
  isTableVisible,
  selectZone
}) => {
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
    <div className={classes.root}>
      <Typography variant='h6' align='center'>
        {branchName}
      </Typography>
      <Typography variant='subtitle1' align='center'>
        {' '}
        Select flow type
      </Typography>
      <List disablePadding>
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
    isTableVisible: branchDetailSlice.isTableVisible,
    branchName: branchDetailSlice.branchName
  }
}

export default connect(mapStateToProps, { showTable, selectZone })(BranchDetailControl)

BranchDetailControl.propTypes = {
  branchName: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  isTableVisible: PropTypes.bool.isRequired,
  showTable: PropTypes.func.isRequired,
  selectZone: PropTypes.func.isRequired
}
