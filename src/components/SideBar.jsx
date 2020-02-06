import React from 'react'
// import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { Drawer, Fab } from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'

const drawerWidth = 240

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

// --- component function
const SideBar = () => {
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
    </Drawer>
  )
}

export default SideBar
