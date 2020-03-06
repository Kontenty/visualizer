import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

const useStyles = makeStyles(theme => ({
  hide: {
    display: 'none'
  },
  drawer: {
    zIndex: 1202
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start'
  },
  drawerPaper: {
    padding: '5px'
  }
}))

const RightBar = ({ children, isOpen, close }) => {
  const classes = useStyles()
  return (
    <Drawer
      className={classes.drawer}
      variant='persistent'
      anchor='right'
      open={isOpen}
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={close}>
          <ChevronRightIcon />
        </IconButton>
      </div>
      <Divider />
      {children}
    </Drawer>
  )
}

export default RightBar

RightBar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node,
  close: PropTypes.func.isRequired
}
