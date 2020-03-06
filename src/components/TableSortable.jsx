import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map(el => el[0])
}
const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Zone' },
  {
    id: 'internal_flow',
    numeric: true,
    disablePadding: false,
    label: 'Internal flows [MW]'
  },
  { id: 'loop_flow', numeric: true, disablePadding: false, label: 'Loop flows [MW]' },
  {
    id: 'impex_flow',
    numeric: true,
    disablePadding: false,
    label: 'Export/import flows [MW]'
  },
  {
    id: 'transit_flow',
    numeric: true,
    disablePadding: false,
    label: 'Transit flows [MW]'
  },
  { id: 'pst_flow', numeric: true, disablePadding: false, label: 'PST flows [MW]' },
  { id: 'zone_total', numeric: true, disablePadding: false, label: 'Zone total [MW]' }
]

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#e3f2fd'
    // color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell)

const StyledHeadCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.grey[100],
    fontWeight: 600
    // color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell)

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort, additionalRow } = props
  const createSortHandler = property => event => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <StyledHeadCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              className={classes.sortLabel}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </StyledHeadCell>
        ))}
      </TableRow>
      <TableRow>
        {additionalRow.map((cell, i) => (
          <StyledTableCell
            align={i === 0 ? 'left' : 'right'}
            padding={i === 0 ? 'none' : 'default'}
            key={'cell' + i}
          >
            {cell}
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  additionalRow: PropTypes.array
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: '900px'
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 500,
    '& .MuiTableCell-sizeSmall': {
      padding: '5px 12px 5px 8px'
    }
  },
  summaryCell: {
    backgroundColor: '#e3f2fd'
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  },
  sortLabel: {}
}))

const EnhancedTable = ({ rows, headRow }) => {
  const classes = useStyles()
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('calories')

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  return (
    <div className={classes.root}>
      <TableContainer>
        <Table
          className={classes.table}
          aria-labelledby='tableTitle'
          size='small'
          aria-label='enhanced table'
        >
          <EnhancedTableHead
            classes={classes}
            // numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
            additionalRow={headRow}
          />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`

              return (
                <TableRow hover tabIndex={-1} key={row.name}>
                  {Object.keys(row).map((key, i) => {
                    if (i === 0) {
                      return (
                        <TableCell
                          key={index + key}
                          component='th'
                          id={labelId}
                          scope='row'
                          padding='none'
                        >
                          {row.name}
                        </TableCell>
                      )
                    } else if (i === Object.keys(row).length - 1) {
                      return (
                        <TableCell
                          key={index + key}
                          align='right'
                          className={classes.summaryCell}
                        >
                          {row[key]}
                        </TableCell>
                      )
                    }
                    return (
                      <TableCell key={index + key} align='right'>
                        {row[key]}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default React.memo(EnhancedTable)

EnhancedTable.propTypes = {
  rows: PropTypes.array.isRequired,
  headRow: PropTypes.array
}
