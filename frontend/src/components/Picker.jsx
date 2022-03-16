import React, { useRef, useState, useEffect} from 'react'
import { useQuery } from '@apollo/client'

// Icons
import { TiDelete } from 'react-icons/ti'

// Graphql
import { GET_COMPANIES } from '../../graphql/companies/query'

// Components
import Table from './Table.jsx';

export default function Picker({
  inputLabel = '',
  inputId = '',
  labelId = '',
  labelText = '',
  companyValue = '',
  handleOnChangeParent = f => f,
}) {

// Table
const tableHeadings = [
  {
    header: 'ID',
    sortBy: 'id',
    allowSort: false,
    style: {
      width: '200px'
    }
  },
  {
    header: 'Name',
    sortBy: 'name',
    allowSort: false,
  }
]

const tableContent = [
    {
      type: 'field',
      name: 'id'
    },
    {
      type: 'field',
      name: 'name'
    }
  ]

  let elementRef = useRef(null);
  let inputRef = useRef(null);

  const [ showPicker, setShowPicker ] = useState(false)
  const [ state, setState ] = useState(false)

  const addBackDrop = (e) => {
    if(showPicker && !elementRef.current.contains(e.target)) {
      setShowPicker(false);
    }
  }

  const handleOnChange = () => {
    const { id, value } = inputRef.current;
    let inputLabel = `${id}-label`
    if (value) {
      document.getElementById(inputLabel).classList.add('not-empty')
    } else {
      document.getElementById(inputLabel).classList.remove('not-empty')
    }
    setState(prevState => ({ ...prevState, [id]: value }));
  }


  useEffect(() => {
    window.addEventListener('click', addBackDrop)
    return () => {
      window.removeEventListener('click', addBackDrop)
    }
  })


  const clearInput = () => {
    inputRef.current.value = '';
    handleOnChangeParent('')
    handleOnChange()
  }

  const getSelectedData = (value) => {
    let result = data.allCompanies.filter(item => item.name == value || item.id == value)
    inputRef.current.value = result[0].name;
    handleOnChangeParent(result[0].id)
    handleOnChange()
    return result
  }

  const { loading, error, data } = useQuery(GET_COMPANIES);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;



  return (
    <div className='entry-wrapper relative' ref={elementRef}>
      <input
        className=''
        type='text'
        onClick={(e)=> {
          e.preventDefault()
          setShowPicker(true)}
        }
        onChange={() => {}}
        ref={inputRef}
        label={inputLabel}
        id={inputId}
        required={true}
        value={state.company || companyValue || ''}
      />
      <label
        className={companyValue ? 'label not-empty': 'label'}
        id={labelId}
        htmlFor={inputLabel}>
          {labelText}
      </label>
      <button className='clear-input' onClick={() => clearInput()}>
        <TiDelete size='2em'/>
      </button>
      {showPicker ? (
        <div className='mdp-container'>
          <Table
            id="table-companies"
            className="w-100"
            heading={tableHeadings}
            rows={data.allCompanies}
            content={tableContent}
            pageSize={data.allCompanies.length}
            showPagination={false}
            onClickTr={(e) => getSelectedData(e.target.innerHTML)}
            tableWrapperStyle={{
              maxHeight: '300px',
              overflow: 'scroll',
              minWidth: '525px'
            }}
          />
        </div>
      ) : ''}
    </div>
  )
}
