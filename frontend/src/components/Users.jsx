import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client';

// Graphql
import { ALL_USERS } from '../../graphql/users/query'

// Components
import Table from './Table.jsx';
import TopNavbar from './TopNavbar.jsx';

// Context
import { GlobalContext } from '../components/context/GlobalProvider'

// Hooks
import { useNotification } from '../../graphql/hooks/useNotification'

export default function Users() {

  const { userToken, userID, isLogin } = useContext(GlobalContext)
  const [ userTokenValue, setUserToken ] = userToken
  const { loading, error, data } = useQuery(ALL_USERS)

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  // Table
  const tableHeadings = [
    {
      header: 'ID',
      sortBy: 'id',
      style: {
        width: '150px'
      },
      allowSort: true,
    },
    {
      header: 'Username',
      sortBy: 'username',
      allowSort: true,
    },
    {
      header: 'First Name',
      sortBy: 'firstName',
      allowSort: true,
    },
    {
      header: 'Last Name',
      sortBy: 'lastName',
      allowSort: true,
    },
    {
      header: 'Email',
      sortBy: 'email',
      allowSort: true,
    },
    {
      header: 'Is Staff',
      sortBy: 'isStaff',
      allowSort: true,
    },
    {
      header: 'Is Active',
      sortBy: 'isActive',
      allowSort: true,
    },
    {
      header: 'Superuser',
      sortBy: 'isSuperuser',
      allowSort: true,
    },
    {
      header: '',
      sortBy: ''
    },
  ]

  const tableContent = [
    {
      type: 'field',
      name: 'id'
    },
    {
      type: 'field',
      name: 'username'
    },
    {
      type: 'field',
      name: 'firstName'
    },
    {
      type: 'field',
      name: 'lastName'
    },
    {
      type: 'field',
      name: 'email'
    },
    {
      type: 'field',
      name: 'isStaff'
    },
    {
      type: 'field',
      name: 'isActive'
    },
    {
      type: 'field',
      name: 'isSuperuser'
    },
    // {
    //   type: 'button',
    //   tdClassName: 'flex brdr-lz brdr-tz',
    //   items: []
    // }
  ]

  let dataCleared = data.users.edges.map(item => item.node)
  let dataCopy = JSON.parse(JSON.stringify(dataCleared))
  let dataTable = []

  dataTable = dataCopy.map(item => {
    item['id'] = item['pk']
    delete item.pk
    return item
  })

  return (
    <div className="wrapper">
      <TopNavbar viewTitle={'Companies'} />
      <div className="centered w-95 flex fdc">
        {/* <button onClick={() =>  useNotification(extraClass, title, message)}>TEST</button> */}
        <div className="mt mb w-100 flex jcsb">
          <div id="modalWindowContainer" />
          <Table
            id="table-companies"
            className="w-100"
            heading={tableHeadings}
            rows={dataTable}
            content={tableContent}
            pageSize={10}
            showPagination={true}
          />
        </div>
      </div>
    </div>
  )
}
