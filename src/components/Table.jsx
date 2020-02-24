import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { Table as MuiTable } from '@material-ui/core'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

const useStyles = makeStyles({
  table: {
    maxWidth: 600,
    '& td': {
      fontSize: '12px',
      padding: '4px 12px 4px 8px'
    },
    '& th': {
      fontSize: '11px',
      padding: '4px 12px 4px 8px'
    }
  }
})

const Table = ({ columns, rows }) => {
  const classes = useStyles()
  return (
    <MuiTable className={classes.table} size='small' aria-label='a dense table'>
      <TableHead>
        <TableRow>
          {columns.map((col, i) => (
            <TableCell align='right' key={i + col}>
              {col}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(row => (
          <TableRow key={row[0]}>
            <TableCell component='th' scope='row'>
              {row[0]}
            </TableCell>
            {row[1].map((cell, i) => (
              <TableCell key={i + cell} align='right'>
                {cell}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </MuiTable>
  )
}

export default React.memo(Table)

Table.propTypes = {
  rows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired
}
