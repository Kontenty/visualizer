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
import { fetchBranchData } from 'slices/geoDataSlice'

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

const fileList = [
  'VIZ-DEC_20181121_0630_FO3_UC8_PFC.json',
  'VIZ-DEC_20181130_1030_FO5_UC8_PFC.json',
  'VIZ-DEC_20190203_2330_FO7_UC8_PFC.json',
  'VIZ-DEC_20190318_1930_FO1_UC8_PFC.json',
  'VIZ-DEC_20190418_1630_FO4_UC8_PFC.json',
  'VIZ-DEC_20190422_1530_FO1_UC8_PFC.json',
  'VIZ-DEC_20190508_0830_FO3_UC8_PFC.json',
  'VIZ-DEC_20190624_0930_FO1_UC8_PFC.json',
  'VIZ-DEC_20190722_1330_FO1_UC8_PFC.json',
  'VIZ-DEC_20190723_1630_FO2_UC8_PFC.json'
]

// --- component function
const SideBar = ({ colorScheme, setColorScheme, branchDataName, fetchBranchData }) => {
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
      <FormControl className={classes.select}>
        <InputLabel id='datasource-select-label'>Select data source</InputLabel>
        <Select
          labelId='datasource-select-label'
          id='datasource-select'
          value={branchDataName}
          onChange={ev => fetchBranchData(ev.target.value)}
        >
          {fileList.map(file => (
            <MenuItem key={file} value={file}>
              {file}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Divider />
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

const mapStateToProps = ({ branchDetailSlice, mapLook, geoData }) => ({
  showSelector: branchDetailSlice.isVisible,
  colorScheme: mapLook.colorScheme,
  branchDataName: geoData.branchDataName
})
const mapDispatch = { setColorScheme, fetchBranchData }

export default connect(mapStateToProps, mapDispatch)(SideBar)

SideBar.propTypes = {
  colorScheme: PropTypes.string,
  branchDataName: PropTypes.string,
  setColorScheme: PropTypes.func,
  fetchBranchData: PropTypes.func
}
