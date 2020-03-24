import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Transition } from 'react-transition-group'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import styled from 'styled-components'
// import { select } from 'd3-selection'
import { scaleDiverging, scaleSequential, scaleLinear } from 'd3-scale'
// import { axisRight } from 'd3-axis'
import * as d3 from 'd3'

const StyleD = styled.div`
  padding: 15px 25px;
  display: flex;
  justify-content: center;
  .tick text {
    font-size: 12px;
  }
  display: ${({ state }) => (state === 'exited' ? 'none' : 'block')};
  transition: 300ms ease;
  opacity: ${({ state }) => (state === 'entered' ? 1 : 0.01)};
`

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
  }
})

export function LegendWidget({ colorPalette }) {
  const [isVisible, setIsVisible] = useState(false)
  const classes = useStyles(isVisible)

  const colorScaleType = useSelector(({ mapLook }) => mapLook.colorScaleType)
  const colorScheme = useSelector(({ mapLook }) => mapLook.colorScheme)
  const minMax = useSelector(({ branchDetail }) => branchDetail.normMinMax)
  const sumPerZone = useSelector(({ branchDetail }) => branchDetail.sumPerZone)

  const calcColors = num => {
    // const values = Object.values(data);
    // const domain = [d3.min(values), d3.mean(values), d3.max(values)];
    const scale =
      colorScaleType === 'diverging'
        ? scaleDiverging([0, 0.5, 1], t => colorPalette.div[colorScheme](1 - t))
        : scaleSequential([0, 1], t => colorPalette.seq[colorScheme](t))
    return scale(num)
  }

  function drawLegend() {
    const valuesArr = [...sumPerZone].sort((a, b) => b - a)
    const height = 400
    const width = 100

    // clear svg before adding new
    /* select('#legend-svg')
      .select('svg')
      .remove() */

    const svg = d3
      .select('#legend-svg')
      .append('svg')
      .attr('width', width)
      .attr('height', height)

    const gradient = svg
      .append('defs')
      .append('svg:linearGradient')
      .attr('id', 'gradient')
      .attr('x1', '0%')
      .attr('y1', '90%')
      .attr('x2', '0%')
      .attr('y2', '10%')
      .attr('spreadMethod', 'pad')

    const uniqueArr = [...new Set(valuesArr)]

    const gradientData = []
    for (let i = 0; i < uniqueArr.length; i++) {
      const position = i / (uniqueArr.length - 1)

      gradientData.push({ offset: position, color: calcColors(position) })
    }

    gradient
      .selectAll('stop')
      .data(gradientData)
      .enter()
      .append('stop')
      .attr('offset', d => d.offset)
      .attr('stop-color', d => d.color)

    // add gradient to svg
    svg
      .append('rect')
      .attr('width', width * 0.4)
      .attr('height', height)
      .style('fill', 'url(#gradient)')

    // create scale for axis
    const axisScale = scaleLinear()
      .domain(minMax)
      .nice()
      .range([height - 40, 0])

    const legendAxis = d3
      .axisRight()
      .scale(axisScale)
      .tickFormat(d => Math.round(d).toLocaleString('pl'))
      .tickPadding(6)
    // .tickFormat(d3.format(', 0f'))

    svg
      .append('g')
      .attr('transform', 'translate(45, 20)')
      .call(legendAxis)
  }
  useEffect(() => {
    if (sumPerZone.length > 0) drawLegend()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sumPerZone])

  return (
    <div id='data-widget' className={classes.root}>
      <Fab
        color='primary'
        size='small'
        className={classes.infoBtn}
        onClick={() => setIsVisible(!isVisible)}
        aria-label='add'
      >
        <InfoOutlinedIcon />
      </Fab>
      <Transition in={isVisible} timeout={300} unmountOnExit>
        {state => (
          <StyleD state={state}>
            <h2>hello</h2>
            <div id='legend-svg' />
          </StyleD>
        )}
      </Transition>
    </div>
  )
}

export default React.memo(LegendWidget)

LegendWidget.propTypes = {
  colorPalette: PropTypes.object.isRequired
}
