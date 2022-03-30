import React, { useState } from 'react'
import ReactDOM from 'react-dom';
import { useQuery, useMutation } from '@apollo/client'
import { v4 as uuidv4 } from 'uuid';

// Graphql
import { GET_COMPANIES, GET_COMPANY } from '../../graphql/companies/query'
import { DELETE_COMPANY, ADD_COMPANY } from '../../graphql/companies/mutation'

// Custom Hooks
import { useNotification } from '../../graphql/hooks/useNotification.js';

// Components
import Form from './Form.jsx';
import Table from './Table.jsx';
import ModalWindow from './ModalWindow.jsx'
import Button from './Button.jsx';
import Pagination from './Pagination.jsx';
import TopNavbar from './TopNavbar.jsx';

export default function Companies() {

  const [ pageSize, setPageSize ] = useState(17)

  // Graphql Mutations
  const [ addCompany ] = useMutation(ADD_COMPANY, {
    onCompleted(data) {
      unmountWindow()
      const extraClass = "notification-success"
      const title = "Add Company"
      const message = `The company has been added.`
      useNotification(extraClass, title, message)
    },
    onError(){
      const extraClass = "notification-error"
      const title = "Add Company Error"
      const message = `Has not been possible to add the new company.`
      useNotification(extraClass, title, message)
    },
    refetchQueries: [
      {
        query: GET_COMPANIES,
      },
    ]
  });

  const [ deleteCompany ] = useMutation(DELETE_COMPANY, {
    onCompleted(data) {
      unmountWindow()
      const extraClass = "notification-success"
      const title = "Delete Company"
      const message = `The company has been deleted.`
      useNotification(extraClass, title, message)
    },
    refetchQueries: [
      {
        query: GET_COMPANIES,
      },
    ]
  });

  // Modal Window Functions
  const addCompanyModal = (clearForm) => {
    const elem = document.querySelector('#modalWindowContainer');
    ReactDOM.render(
      <ModalWindow
        showCloseBtn={true}
        clearForm={clearForm}
        buttonLabel='Add Company'
      >
        <Form
          id="form-add-company"
          title="Add Company"
          values={formValues}
          buttons={formButtons}
        />
    </ModalWindow>
      , elem);
  }

  const deleteCompanyModal = (id) => {
    const deleteCompanyModalButtons = [
      {
        function: unmountWindow,
        label: 'Cancel',
        variables: [''],
        param: { variables: ''},
        className: "btn cancel-btn centered",
        style: { width: '40%' }
      },
      {
        function: deleteCompany,
        label: 'Delete',
        variables: ['id'],
        param: { variables: { id: id.variables.id }},
        className: "btn confirm-btn centered",
        style: { width: '40%' }
      }
    ]

    const elem = document.querySelector('#modalWindowContainer');

    ReactDOM.render(
      <ModalWindow
        showCloseBtn={true}
        clearForm=''
        buttonLabel=''
      >
        <Form
          id="form-add-company"
          title="Delete Company"
          values=''
          buttons={deleteCompanyModalButtons}
          formText='Are you sure you want to delete the selected company?'
        />
    </ModalWindow>
      , elem);
  }

  const unmountWindow = () => {
    const elem = document.querySelector('#modalWindowContainer');
    ReactDOM.unmountComponentAtNode(elem)
  }


  const getCompanyData = (id) => {
    data.allCompanies.filter(obj => {
      if(obj.id == id) {
        console.log(
          `ID: ${obj.id}, Name: ${obj.name}`
        )
      }
    })
  }


  // const singleCompany = useQuery(GET_COMPANY, {
  //   refetchQueries: [
  //     {
  //       query: GET_COMPANIES,
  //     },
  //   ]
  // })


  const test = (a) => {
    console.log(a)
  }

  const { loading, error, data } = useQuery(GET_COMPANIES);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;


  console.log(data.allCompanies)

  // Form
  const formValues = [
    {
      id: uuidv4(),
      label: 'name',
      name: 'name',
      type: 'text',
      extraType: '',
      inputClassName: 'write',
      labelClassName: 'label',
      required: true,
      attributes: {
        required: true,
        pattern: ''
      },
      value: ''
    },
    {
      id: uuidv4(),
      label: 'website',
      name: 'website',
      type: 'text',
      extraType: '',
      inputClassName: 'write',
      labelClassName: 'label',
      attributes: {
        required: true,
        pattern: ''
      },
      value: ''
    },
    {
      id: uuidv4(),
      label: 'telephone',
      name: 'telephone',
      type: 'text',
      extraType: '',
      inputClassName: 'write',
      labelClassName: 'label',
      attributes: {
        required: true,
        pattern: ''
      },
      value: ''
    },
  ]

  const formButtons = [
    {
      function: unmountWindow,
      label: 'Cancel',
      variables: [''],
      param: { variables: ''},
      className: "btn cancel-btn centered",
      style: { width: '40%' }
    },
    {
      function: addCompany,
      label: 'Add Company',
      variables: ['name', 'website', 'telephone'],
      param: { variables: { name: '', website: '', telephone: '' }},
      className: "btn confirm-btn centered",
      style: { width: '40%' }
    }
  ]

  // Table
  const tableHeadings = [
    {
      header: 'ID',
      sortBy: 'id',
      style: {
        width: '200px'
      },
      allowSort: true,
    },
    {
      header: 'Name',
      sortBy: 'name',
      allowSort: true,
    },
    {
      header: 'Website',
      sortBy: 'website',
      allowSort: true,
    },
    {
      header: 'Telephone',
      sortBy: 'telephone',
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
      name: 'name'
    },
    {
      type: 'field',
      name: 'website'
    },
    {
      type: 'field',
      name: 'telephone'
    },
    {
      type: 'button',
      tdClassName: 'flex brdr-lz brdr-tz',
      items: [
        {
          function: deleteCompanyModal,
          variables: ['id'],
          param: { variables: { id: '' }},
          iconClassName: "trash",
          icon: '',
          style: {width: '30%' }
        },
        {
          function: test,
          variables: ['id'],
          param: { variables: { id: '' }},
          iconClassName: "trash",
          icon: '',
          style: {width: '30%' }
        }
      ]
    }
  ]

  return (
    <div className="wrapper">
      <TopNavbar viewTitle={'Companies'} />
      <div className="centered w-95 flex fdc">
        <div className="mt mb w-100 flex jcsb">
          <div id="modalWindowContainer" />
          {/* <Button
            key={uuidv4()}
            id={'add-company-btn'}
            className="btn add-company-btn centered"
            label='Add Company'
            function={addCompanyModal}
            funcParam={false}
            param=''
            variables=''
            iconClassName=""
            icon=''
            style={{ width: '150px' }}
          /> */}
        </div>
        <div>
          <Table
            id="table-companies"
            className="w-100"
            heading={tableHeadings}
            rows={data.allCompanies}
            content={tableContent}
            pageSize={pageSize}
            showPagination={true}
          />
        </div>
      </div>
    </div>
  )
}
