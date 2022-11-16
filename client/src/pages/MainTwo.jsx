import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import { Toolbar } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import AccessibilityIcon from '@mui/icons-material/Accessibility';

import { getAllUsers } from '../http/userAPI'

const headCells = [
  {
    id: 'id',
    disablePadding: true,
    label: 'ID',
  },
  {
    id: 'name',
    disablePadding: false,
    label: 'name',
  },
  {
    id: 'email',
    numeric: true,
    disablePadding: false,
    label: 'email',
  },
  {
    id: 'status',
    disablePadding: false,
    label: 'status',
  },
  {
    id: 'registryDate',
    disablePadding: false,
    label: 'Created at',
  },
  {
    id: 'lastLoginDate',
    disablePadding: false,
    label: 'Last login date',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick } =
    props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all users',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
          >
            <TableSortLabel
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar(props) {
  const { numSelected, selected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Users
        </Typography>
      )}

      {numSelected > 0 ? (
        <>
        <Tooltip title="Delete">
          <IconButton onClick={() => console.log('delete')}>
            <DeleteIcon color="error"/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Block" color="secondary">
          <IconButton onClick={() => console.log('block')}>
            <BlockIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Unblock">
          <IconButton onClick={() => console.log('unbclock')}>
            <AccessibilityIcon color="primary"/>
          </IconButton>
        </Tooltip>
        </>
      ) : null}
    </Toolbar>
  );
}

export default function MainTwo() {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState([])

  useEffect(() => {
    getAllUsers().then(data => {
      setList(data)
    }).finally(() => setLoading(false))
}, [])

if (loading) {
  return (
    <div style={{height: 600}} className="d-flex justify-content-center align-items-center">
      <Spinner animation="border" variant="info"  as="div"/>
    </div>
  )
}

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = list.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };


  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} selected={selected}/>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={list.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.sort(getComparator(order, orderBy)).slice() */}
              {
                list.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.id}
                      </TableCell>
                      <TableCell align="right">{row.name}</TableCell>
                      <TableCell align="right">{row.email}</TableCell>
                      <TableCell align="right">{row.userStatus}</TableCell>
                      <TableCell align="right">{row.registryDate}</TableCell>
                      <TableCell align="right">{row.lastLoginDate}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}