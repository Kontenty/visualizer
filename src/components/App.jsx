import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

// import Map from './Map'
import MapRGL from './MapRMG'
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
    height: 'calc(100vh - 64px)'
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
        {/* <div className={classes.mapWrapper}>
          <Map />
        </div> */}
        <div className={classes.mapWrapper}>
          <MapRGL />
          <MapStyleToggle />
        </div>
      </main>
    </>
  )
}

export default App
