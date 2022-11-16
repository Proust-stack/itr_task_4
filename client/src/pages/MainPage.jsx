import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap'
import Table from 'react-bootstrap/Table';
import InputGroup from 'react-bootstrap/InputGroup';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Toolbar } from '@mui/material';

import { getAllUsers } from '../http/userAPI'

const columns  = [
  { field: 'id', headerName: 'ID' },
  { field: 'name', headerName: 'name'},
  { field: 'email', headerName: 'email' },
  {
    field: 'userStatus',
    headerName: 'status',
  },
  {
    field: 'registryDate',
    headerName: 'Created at',
  },
  {
    field: 'lastLoginDate',
    headerName: 'Last login date',
  },
];

export default function MainPage() {

  const [loading, setLoading] = useState(true)
  const [list, setList] = useState([])
  const [checked, setChecked] = useState([])
  console.log(list);

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
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Toolbar>
        <Button>Block</Button>
        <Button>Unblock</Button>
        <Button>Delete</Button>
      </Toolbar>
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={list}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        //selected={isItemSelected}
      />
    </div>
    </div>
  )
}
