import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  toolBar: {
    justifyContent: 'center'
  }
}))

export default function NavBar() {
  const classes = useStyles()

  return (
    <AppBar position='fixed' className={classes.appBar}>
      <Toolbar className={classes.toolBar}>
        <Typography variant='h4' align='center' noWrap>
          Visualizer
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
