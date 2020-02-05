import React from 'react'
// import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { Drawer } from '@material-ui/core'

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
    </Drawer>
  )
}

export default SideBar
