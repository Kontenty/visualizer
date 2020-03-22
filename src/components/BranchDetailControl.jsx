import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import {
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Switch,
  Typography
} from '@material-ui/core'
import CompareArrowsIcon from '@material-ui/icons/CompareArrows'
import CallMadeIcon from '@material-ui/icons/CallMade'
import LoopIcon from '@material-ui/icons/Loop'
import ShuffleIcon from '@material-ui/icons/Shuffle'
import TuneIcon from '@material-ui/icons/Tune'

import { showTable, selectCategory } from 'slices/branchDetailSlice'

const useStyles = makeStyles({
  root: {
    marginTop: '1rem'
  },
  checkBox: {
    padding: '3px 9px'
  },
  listIcon: {
    minWidth: '10px',
    marginRight: '16px'
  },
  btnWrap: {
    display: 'flex',
    justifyContent: 'center',
    margin: '5px 0'
  },
  header: {
    display: 'flex',
    paddingLeft: '5px',
    marginBottom: '5px'
  },
  chip: {
    height: '26px',
    fontWeight: 'bold',
    marginRight: '10px'
  }
})

const switchListIcons = [
  <CallMadeIcon key='ic1' />,
  <LoopIcon key='ic2' />,
  <CompareArrowsIcon key='ic3' />,
  <ShuffleIcon key='ic4' />,
  <TuneIcon key='ic5' />
]

const options = {
  IN: 'Internal flows [MW]',
  LF: 'Loop flows [MW]',
  IE: 'Export/import flows [MW]',
  TR: 'Transit flows [MW]',
  PST: 'PST flows [MW]'
}

const formatCoName = name => {
  if (name.includes(' + ')) {
    // const splited = name.split(' + ')
    return name.split(' + ').join('   ')
  }

  return name
}

const BranchDetailControl = ({
  branchName,
  coName,
  showTable,
  isTableVisible,
  selectCategory
}) => {
  const classes = useStyles()
  const [checked, setChecked] = React.useState([])

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
    selectCategory(newChecked)
  }

  return (
    <div className={classes.root}>
      <Typography variant='subtitle1' align='left' className={classes.header}>
        <Chip label='CB' color='primary' className={classes.chip} />
        <span>{branchName || '...'}</span>
      </Typography>
      <Typography variant='subtitle1' align='left' className={classes.header}>
        <Chip label='CO' color='primary' className={classes.chip} />
        <span>{formatCoName(coName) || '...'}</span>
      </Typography>
      <Divider />
      <Typography variant='subtitle2' align='center'>
        Select flow type
      </Typography>
      <Divider />
      <List>
        {Object.keys(options).map((key, index) => (
          <ListItem button dense key={key} onClick={handleToggle(key)}>
            <ListItemIcon className={classes.listIcon}>
              {switchListIcons[index]}
            </ListItemIcon>
            <ListItemText primary={options[key]} />
            <ListItemSecondaryAction>
              <Switch
                edge='end'
                checked={checked.indexOf(key) !== -1}
                onChange={handleToggle(key)}
                value={key}
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Divider />
      <div className={classes.btnWrap}>
        <Button variant='outlined' onClick={() => showTable()}>
          {isTableVisible ? 'Hide table' : 'Show branch table'}
        </Button>
      </div>
    </div>
  )
}

function mapStateToProps({ branchDetail }) {
  return {
    isTableVisible: branchDetail.isTableVisible,
    branchName: branchDetail.branchName,
    coName: branchDetail.coName
  }
}

export default connect(mapStateToProps, { showTable, selectCategory })(
  BranchDetailControl
)

BranchDetailControl.propTypes = {
  branchName: PropTypes.string.isRequired,
  coName: PropTypes.string.isRequired,
  isTableVisible: PropTypes.bool.isRequired,
  showTable: PropTypes.func.isRequired,
  selectCategory: PropTypes.func.isRequired
}
