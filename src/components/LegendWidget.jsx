import React, { useState, useMemo } from 'react'
import { CSSTransition } from 'react-transition-group'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Fab, Tabs, Tab } from '@material-ui/core'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import LinearScaleIcon from '@material-ui/icons/LinearScale'
import BarChartIcon from '@material-ui/icons/BarChart'
import Typography from '@material-ui/core/Typography'

// import BarChart from './DgwBarChart';
// import Legend from './DgwLegend';

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component='div'
      role='tabpanel'
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </Typography>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`
  }
}

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    top: '20px',
    left: '25px',
    // width: '200px',
    'z-index': 1000
  },
  infoBtn: {
    position: 'relative',
    left: '-18px',
    top: '-13px'
  },
  tabswrapper: isVisible => ({
    transition: 'opacity 500ms ease-in-out',
    opacity: isVisible ? 1 : 0
  }),
  tabContent: {
    backgroundColor: 'rgba(255,255,255, 0.3)'
  }
})

export default function LegendWidget({
  data,
  middle,
  colorPalette,
  mapColor,
  graphMinMax,
  colorScaleType
}) {
  const [tabNo, setTabNo] = React.useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const classes = useStyles(isVisible)

  const handleChange = (event, newValue) => {
    setTabNo(newValue)
  }

  const calcDataForBar = dt => {
    let result = []
    Object.keys(dt)
      .sort((a, b) => dt[b] - dt[a])
      .forEach(key => {
        result.push({
          country: key,
          value: Math.round(dt[key] * 100) / 100
        })
      })
    return result
  }

  const dataForBar = useMemo(() => calcDataForBar(data), [data, mapColor])

  return (
    <div id='data-widget' className={classes.root}>
      <Fab
        color='primary'
        size='medium'
        className={classes.infoBtn}
        onClick={() => setIsVisible(!isVisible)}
        aria-label='add'
      >
        <InfoOutlinedIcon />
      </Fab>
      <CSSTransition in={isVisible} classNames='fade-scale' timeout={500} unmountOnExit>
        <div>
          <AppBar position='static'>
            <Tabs value={tabNo} onChange={handleChange} aria-label='data tabs'>
              <Tab icon={<LinearScaleIcon />} {...a11yProps(0)} />
              <Tab icon={<BarChartIcon />} {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          {/* <TabPanel value={tabNo} index={0}>
            <div className={classes.tabContent}>
              <Legend
                data={data}
                middle={middle}
                colorPalette={colorPalette}
                colorScaleType={colorScaleType}
              />
            </div>
          </TabPanel>
          <TabPanel value={tabNo} index={1}>
            <div className={classes.tabContent}>
              <BarChart
                chartData={dataForBar}
                colorPalette={colorPalette}
                data={data}
                graphMinMax={graphMinMax}
              />
            </div>
          </TabPanel> */}
        </div>
      </CSSTransition>
    </div>
  )
}

LegendWidget.propTypes = {
  data: PropTypes.object.isRequired,
  middle: PropTypes.string.isRequired,
  colorPalette: PropTypes.func.isRequired,
  graphMinMax: PropTypes.object.isRequired
}
