import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import {
  Drawer,
  Divider,
  Fab,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'

import BranchDetailControl from './BranchDetailControl'
import { setColorScheme } from 'slices/mapLookSlice'

const drawerWidth = 290

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  toolbar: theme.mixins.toolbar,
  uploadContainer: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '10px'
  },
  select: {
    margin: '10px 15px'
  }
}))

const colors = ['orange', 'red', 'blue']

// --- component function
const SideBar = ({ colorScheme, setColorScheme }) => {
  const classes = useStyles()

  return (
    <Drawer
      className={classes.drawer}
      variant='permanent'
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <div className={classes.toolbar} />
      <div className={classes.uploadContainer}>
        <label htmlFor='upload-file'>
          <input
            style={{ display: 'none' }}
            id='upload-file'
            name='upload-file'
            type='file'
          />
          <Fab
            color='primary'
            size='small'
            component='span'
            aria-label='add'
            variant='extended'
          >
            <CloudUploadIcon fontSize='small' style={{ margin: '0 5px 0 3px' }} /> Upload
            file
          </Fab>
        </label>
      </div>
      <BranchDetailControl />
      <Divider />
      <FormControl className={classes.select}>
        <InputLabel id='color-select-label'>Select map color</InputLabel>
        <Select
          labelId='color-select-label'
          id='color-select'
          value={colorScheme}
          onChange={ev => setColorScheme(ev.target.value)}
        >
          {colors.map(color => (
            <MenuItem key={color} value={color}>
              {color}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Drawer>
  )
}

function mapStateToProps({ branchDetailSlice, mapLook }) {
  return {
    showSelector: branchDetailSlice.isVisible,
    colorScheme: mapLook.colorScheme
  }
}

export default connect(mapStateToProps, { setColorScheme })(SideBar)

SideBar.propTypes = {
  showSelector: PropTypes.bool.isRequired,
  colorScheme: PropTypes.string,
  setColorScheme: PropTypes.func
}
