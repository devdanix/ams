import React, { useState, useEffect } from 'react'
import _ from 'lodash'

// Icons
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

// Components
import Button from './Button.jsx'
import Pagination from './Pagination.jsx'


export default function Table(props) {

  const [ currentPage, setCurrentPage ] = useState(0)
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
    const pageFrom = currentPage == 0 ? 0 : currentPage * pageSize
    const pageTo = currentPage == 0 ? pageSize : (currentPage * pageSize) + pageSize
    return data.slice(pageFrom, pageTo);
  }

  const getPropByString = (obj, propString) => {
    if (!propString)
       return obj;

    let prop, props = propString.split('.');
    let i = 0, iLen = props.length

    for (i ; i < iLen; i++) {
      prop = props[i];

      let item = obj[prop];
      if (item !== undefined) {
        obj = item;
      } else {
        break;
      }
    }
    return obj;
  }

  const sortTable = (key, subKey) => {
    key = key.toLowerCase()
    let newTable = table.slice()
    if (subKey) {
      if(sort == 'asc'){
        if(prevSort == key) {
          newTable.sort((a,b) => {
            if (isNaN(b[key])){
              return b[key][subKey].localeCompare(a[key][subKey])
            } else {
              return parseInt(b[key][subKey]) > parseInt(a[key][subKey])
            }
          })
          setSort('desc')
        } else {
          newTable.sort((a,b) => {
            if (isNaN(a[key])) {
              return a[key][subKey].localeCompare(b[key][subKey])
            } else {
              return parseInt(a[key][subKey]) > parseInt(b[key][subKey])
            }
          })
        }
      } else {
        newTable.sort((a,b) => {
          if (isNaN(a[key])) {
            return a[key][subKey].localeCompare(b[key][subKey])
          } else {
            return parseInt(a[key][subKey]) > parseInt(b[key][subKey])
          }
        })
        setSort('asc')
      }
    } else {
      if(sort == 'asc'){
        if(prevSort == key) {
          newTable.sort((a,b) => {
            if (isNaN(b[key])){
              return b[key].localeCompare(a[key])
            } else {
              return parseInt(b[key]) > parseInt(a[key])
            }
          })
          setSort('desc')
        } else {
          newTable.sort((a,b) => {
            if (isNaN(a[key])) {
              return a[key].localeCompare(b[key])
            } else {
              return parseInt(a[key]) > parseInt(b[key])
            }
          })
        }
      } else {
        newTable.sort((a,b) => {
          if (isNaN(a[key])) {
            return a[key].localeCompare(b[key])
          } else {
            return parseInt(a[key]) > parseInt(b[key])
          }
        })
        setSort('asc')
      }
    }
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
        if(obj[property].toLowerCase().includes(inputFilters[property])){
          loopTable.push(obj)
        }
        result = loopTable
      })
    }
    setTable(currentTableData(result))
    setFilterTable(result)
    setCurrentPage(0)
  }, [inputFilters, currentInputFiltersHeading, currentInputFiltersValue])

  const searchColumnInput = props.heading.map((heading, index) => {
    if (heading.header) {
      return (
        <th className="search-heading" key={index}>
          <input
            className="search-input"
            onChange={(e) => {
              e.preventDefault()
              searchColumn(e.target.value, heading.header.toLowerCase())
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
    if (prevSort == heading.header.toLowerCase() && sort == 'asc') {
      sortIcon = 'faSortUp'
      sortIconClass = 'sort-active'
    } else if (prevSort == heading.header.toLowerCase() && sort == 'desc') {
      sortIcon = 'faSortDown'
      sortIconClass = 'sort-active'
    } else if (heading.header) {
      sortIcon = 'faSort'
      sortIconClass = 'sort-inactive'
    }

    return (
      <th
        key={index}
        onClick={() => {
          heading.header ?
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
          <td className={item.tdClassName} key={index}>{getPropByString(record, item.name)}</td>
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
      <tr key={index}>{field}</tr>
    )
  })

  return (
    <div id="table">
      <Pagination
        data={filterTable}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
      />
      <table id={tableID} className={props.className}>
        <thead>
          <tr>
            {searchColumnInput}
          </tr>
          <tr>
            {tableHeadings}
          </tr>
        </thead>
        <tbody>
            {tableRows}
        </tbody>
      </table>
    </div>
  )
}
