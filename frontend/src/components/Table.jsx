import React, { useState, useEffect } from 'react'
import _ from 'lodash'

// Icons
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

// Components
import Button from './Button.jsx'
import Pagination from './Pagination.jsx'


export default function Table(props) {

  const [ currentPage, setCurrentPage ] = useState(1)
  // const [ pageSize, setPageSize ] = useState(18)
  const [ inputFilters, setInputFilter ] = useState({})
  const [ currentInputFiltersValue, setCurrentInputFilterValue ] = useState('')
  const [ currentInputFiltersHeading, setCurrentInputFilterHeading ] = useState('')
  const [ table, setTable ] = useState(props.rows)
  const [ filterTable, setFilterTable ] = useState(props.rows)
  const [ sort, setSort ] = useState('asc')
  const [ prevSort, setPrevSort ] = useState('id')
  const pageSize = props.pageSize
  const tableID = props.id

  useEffect(() => {
    setTable(currentTableData(filterTable));
  },[currentPage, inputFilters]);

  const currentTableData = (data) => {
    const pageFrom = currentPage == 0 ? 0 : (currentPage - 1) * pageSize
    const pageTo = currentPage == 0 ? pageSize : ((currentPage - 1) * pageSize) + pageSize
    return data.slice(pageFrom , pageTo);
  }

  const getPropByString = (obj, propString) => {
    if (!propString)
       return obj;

    let prop, props = propString.split('.');
    let i = 0, iLen = props.length

    for (i ; i < iLen; i++) {
      prop = props[i];

      let item = obj[prop];
      if (item !== undefined && typeof(item) !== "boolean") {
        obj = item;
      } else if (typeof(item) === "boolean") {
        let temp = new Boolean(item)
        obj = temp.toString()
      } else {
        break
      }
    }
    return obj;
  }

  const sortTable = (key) => {
    let newTable = table.slice()
    newTable.sort((a, b) => {
      if(sort === 'asc') {
        // Sort desc
        if(a[key] === null || a[key] === '') return 1
        if(b[key] === null || b[key] === '') return -1
        if (a[key] === b[key]) return 0
        if(isNaN(a[key]) || typeof(a[key]) === 'boolean') return a[key] < b[key] ? 1 : -1
        return parseInt(a[key]) < parseInt(b[key]) ? 1 : -1;
      } else {
        // Sort asc
        if(a[key] === null || a[key] === '') return -1
        if(b[key] === null || b[key] === '') return 1
        if (a[key] === b[key]) return 0
        if(isNaN(a[key]) || typeof(a[key]) === 'boolean') return a[key] < b[key] ? -1 : 1
        return parseInt(a[key]) < parseInt(b[key]) ? -1 : 1;
      }
    })
    setSort(sort === 'asc' ? 'desc' : 'asc')
    setPrevSort(key)
    setTable(newTable)
  }

  const searchColumn = (value, heading) => {
    setInputFilter(prevState => ({ ...prevState, [heading]: value }))
    setCurrentInputFilterValue(value)
    setCurrentInputFilterHeading(heading)
  }

  useEffect(() => {
    let result = props.rows
    let loopTable = []

    if(!inputFilters[currentInputFiltersHeading]) {
      delete inputFilters[currentInputFiltersHeading]
    }

    if (_.isEmpty(inputFilters)) {
      setTable(currentTableData(props.rows))
      setFilterTable(props.rows)
      return
    }

    for (const property in inputFilters) {
      loopTable = []
      result.filter((obj) => {
        if(obj[property]) {
          if(obj[property].toString().toLowerCase().includes(inputFilters[property])){
            loopTable.push(obj)
          }
        }
        result = loopTable
      })
    }
    setTable(currentTableData(result))
    setFilterTable(result)
    setCurrentPage(1)
  }, [inputFilters, currentInputFiltersHeading, currentInputFiltersValue])

  const searchColumnInput = props.heading.map((heading, index) => {
    if (heading.header) {
      return (
        <th className="search-heading" key={index}>
          <input
            className="search-input"
            onChange={(e) => {
              e.preventDefault()
              searchColumn(e.target.value, heading.sortBy)
            }}
            placeholder={`Search ${filterTable.length} records..`}></input>
        </th>
      )
    } else {
      return <th key={index} className="search-heading"/>
    }
  })

  const tableHeadings = props.heading.map((heading, index) => {
    let sortIcon, sortIconClass = ''
    if (heading.allowSort) {
      if (prevSort == heading.sortBy && sort === 'asc') {
        sortIcon = 'faSortUp'
        sortIconClass = 'sort-active'
      } else if (prevSort == heading.sortBy && sort === 'desc') {
        sortIcon = 'faSortDown'
        sortIconClass = 'sort-active'
      } else if (heading.sortBy) {
        sortIcon = 'faSort'
        sortIconClass = 'sort-inactive'
      }
    }

    return (
      <th
        key={index}
        onClick={() => {
          heading.header && heading.allowSort  ?
          sortTable(heading.sortBy, heading.subKey) :
          ''
          }}
        style={heading.style}
      >
        {heading.header}
        {sortIcon === 'faSortUp' ? <FaSortUp/> : ''}
        {sortIcon === 'faSortDown' ? <FaSortDown/> : ''}
        {sortIcon === 'faSort' ? <FaSort/> : ''}
      </th>
    )
  })

  const tableRows = table.map((record, index) => {
    let field = props.content.map((item, index) => {
      if (item.type == 'field') {
        return (
          <td
            className={item.tdClassName}
            key={index}
          >
            {getPropByString(record, item.name)}
          </td>
        )
      } else if (item.type == 'button') {
        let buttons = item.items.map((btn, index) => {
          let variables = {...btn.param.variables};
          if (btn.variables) {
            btn.variables.forEach(element => {
              if (isNaN(record[element])) {
                variables[element] = record[element]
              } else {
                variables[element] = parseInt(record[element])
              }
            })
          }
          return (
            <Button
              key={index}
              function={btn.function}
              variables={btn.variables}
              param={{variables: variables}}
              iconClassName={btn.iconClassName}
              icon={btn.icon}
              style={btn.style}
            />
          )
        })
        return (
          <td className={item.tdClassName} key={index}>
            {buttons}
          </td>)
      }
    })
    return (
      <tr key={index} onClick={props.onClickTr}>{field}</tr>
    )
  })

  return (
    <div id="table" style={props.tableWrapperStyle}>
      {props.showPagination ?
      <Pagination
        data={filterTable}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
      /> : ''
      }
      <table id={tableID} className={props.className}>
        <thead>
          <tr>
            {tableHeadings}
          </tr>
          <tr>
            {searchColumnInput}
          </tr>
        </thead>
        <tbody>
            {tableRows}
        </tbody>
      </table>
    </div>
  )
}
