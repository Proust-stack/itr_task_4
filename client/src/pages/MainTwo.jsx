import { alpha } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import React, { useEffect, useState, useContext } from 'react'
import { Spinner } from 'react-bootstrap'
import moment from 'moment';
import { Toolbar } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {Context} from "../index";

import { block, deleteUser, getAllUsers, unBlock } from '../http/userAPI'

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

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
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort  } =
    props;
  const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

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
  const { numSelected, selected, navigate, setData } = props;
  

  const handleBlock = async () => {
    const data = await block(selected)
    setData(data)
    navigate('/main')
  }
  const handleUnblock = async () => {
    const data = await unBlock(selected)
    setData([])
    navigate('/main')
  }
  const handleDelete = async  () => {
    const data = await deleteUser(selected)
    setData(data)
    navigate('/main')
  }

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
          <IconButton onClick={handleDelete}>
            <DeleteIcon color="error"/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Block" color="secondary">
          <IconButton onClick={handleBlock}>
            <BlockIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Unblock">
          <IconButton onClick={handleUnblock}>
            <AccessibilityIcon color="primary"/>
          </IconButton>
        </Tooltip>
        </>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}



 const MainTwo = observer(() => {
  const {user} = useContext(Context)
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState([])
  const [data, setData] = useState([])
  const [order, setOrder] = React.useState('');
  const [orderBy, setOrderBy] = React.useState('');
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);

  const navigate = useNavigate()

  useEffect(() => {
    getAllUsers().then(data => {
      setList(data)
    }).finally(() => setLoading(false))
}, [data])

if (data.includes(user.user.id)) {navigate('/login')}

if (loading) {
  return (
    <div style={{height: 600}} className="d-flex justify-content-center align-items-center">
      <Spinner animation="border" variant="info"  as="div"/>
    </div>
  )
}

const handleRequestSort = (event, property) => {
  const isAsc = orderBy === property && order === 'asc';
  setOrder(isAsc ? 'desc' : 'asc');
  setOrderBy(property);
};

const handleChangeDense = (event) => {
  setDense(event.target.checked);
};

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = list.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id) => {
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const isSelected = (id) => selected.indexOf(id) !== -1;
  const emptyRows =
  page > 0 ? Math.max(0, (1 + page) * rowsPerPage - list.length) : 0;
  
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} selected={selected} navigate={navigate} setData={setData}/>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={list.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.sort(getComparator(order, orderBy)).slice() */}
              {
                stableSort(list, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={() => handleClick(row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
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
                        align="left"
                      >
                        {row.id}
                      </TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="left">{row.email}</TableCell>
                      <TableCell align="left">{row.userStatus}</TableCell>
                      <TableCell align="left" type="date">{moment(`${row.registryDate}`).format('MMMM Do YYYY, h:mm:ss a')}</TableCell>
                      <TableCell align="left" type="date">{moment(`${row.lastLoginDate}`).format('MMMM Do YYYY, h:mm:ss a')}</TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={list.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
})

export default MainTwo