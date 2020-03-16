import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import Map from './map/Map'
import NavBar from './NavBar'
import SideBar from './SideBar'
import MapStyleToggle from './MapStyleToggle'

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
    flexGrow: 1
  },
  toolbar: theme.mixins.toolbar,
  mapWrapper: {
    position: 'relative',
    display: 'flex',
    height: 'calc(100vh - 64px)',
    '& .mapboxgl-popup-content': {
      borderRadius: '5px',
      boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
      padding: '15px 12px 10px'
    }
  }
}))

const App = () => {
  const classes = useStyles()

  return (
    <>
      <CssBaseline />
      <NavBar />
      <SideBar />
      <main className={classes.content}>
        <div className={classes.toolbar} />

        <div className={classes.mapWrapper}>
          <Map />
          <MapStyleToggle />
        </div>
      </main>
    </>
  )
}

export default App
