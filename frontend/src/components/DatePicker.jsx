import React, { useState, useRef, useEffect } from 'react'

export default function DatePicker({
  inputType = 'date',
  inputLabel = '',
  inputId = '',
  labelId = '',
  labelText = '',
  dateToSet = '',
  dateValueKey = '',
  className = '',
  allDay = false,
  setCalendarState = f => f,
}) {



  let oneDay = 60 * 60 * 24 * 1000;
  let todayTimestamp = Date.now() - (Date.now() % oneDay) + (new Date().getTimezoneOffset() * 1000 * 60);
  let dateToSetTimestamp = dateToSet - (dateToSet % oneDay) + (dateToSet.getTimezoneOffset() * 1000 * 60)
  let selectedTimestamp = inputType === 'datetime-local' ? dateToSet.getTime() : dateToSetTimestamp
  let inputRef = useRef(null);
  let elementRef = useRef(null);
  let date = new Date();
  let daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let monthMap = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const getHoursStringFromTimestamp = (timestamp) => {
    let dateObject = new Date(timestamp);
    let hours = dateObject.getHours();
    let minutes = dateObject.getMinutes();
    return (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
  }

  const [ monthDetails, setMonthDetails ] = useState([])
  const [ year, setYear ] = useState(date.getFullYear())
  const [ month, setMonth ] = useState(date.getMonth())
  // const [ selectedDay, setSelectedDay ] = useState(selectedTimestamp)
  const [ selectedDay, setSelectedDay ] = useState(inputType === 'datetime-local' ? dateToSet.getTime() : dateToSetTimestamp)
  const [ time, setTime ] = useState(getHoursStringFromTimestamp(selectedTimestamp))
  const [ showDatePicker, setShowDatePicker ] = useState(false)
  const [ state, setState ] = useState('')

  console.log(state)
  console.log(time)


  useEffect(() => {
    window.addEventListener('click', addBackDrop)
    setDateToInput(selectedDay);
    setMonthDetails(getMonthDetails(year, month))
    return () => {
      window.removeEventListener('click', addBackDrop)
    }
  }, [selectedDay, dateToSet])

  useEffect(() => {
    let hours = time.split(':')[0]
    let minutes = time.split(':')[1]
    let newDate = new Date(selectedDay)
    newDate.setHours(hours)
    newDate.setMinutes(minutes)
    setCalendarState(prevState => ({
      ...prevState,
      [dateValueKey]: new Date(newDate)
    }));
  }, [time])

  useEffect(() => {
    setSelectedDay(inputType === 'datetime-local' ? dateToSet.getTime() : dateToSetTimestamp)
    let hours = time.split(':')[0]
    let minutes = time.split(':')[1]
    let newDate = new Date(selectedDay)
    newDate.setHours(hours)
    newDate.setMinutes(minutes)
    setCalendarState(prevState => ({
      ...prevState,
      [dateValueKey]: new Date(newDate)
    }));
  }, [ allDay])

  const generateHours = () => {
    let minutesInterval = 30
    let times = []
    let start = 540

    for (let i = 0; start < 18 * 60; i++) {
      let hh = Math.floor(start / 60);
      let mm = (start % 60);
      times[i] = ("0" + (hh % 24)).slice(-2) + ':' + ("0" + mm).slice(-2)
      start = start + minutesInterval;
    }

    return times
  }

  const addBackDrop = (e) => {
    if(showDatePicker && !elementRef.current.contains(e.target) || selectedDay && !elementRef.current.contains(e.target)) {
      setShowDatePicker(false);
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

  const setDateToInput = (timestamp) => {
    let dateString = getDateStringFromTimestamp(timestamp);
    if(inputType === 'datetime-local' && time) {
      inputRef.current.value = dateString + 'T' + time
    } else if (inputType === 'datetime-local' && !time) {
      inputRef.current.value = dateString + 'T00:00';
    } else {
      inputRef.current.value = dateString;
    }
    handleOnChange()
  }

  const setTimeToInput = (timestamp) => {
    let dateString = getDateStringFromTimestamp(selectedDay);
    let timeString = getHoursStringFromTimestamp(dateString + ' ' + timestamp);
    inputRef.current.value = dateString + 'T' + timeString;
  }

  const getDateStringFromTimestamp = (timestamp) => {
    let dateObject = new Date(timestamp);
    let month = dateObject.getMonth()+1;
    let date = dateObject.getDate();
    return dateObject.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date);
  }

  // const getHoursStringFromTimestamp = (timestamp) => {
  //   let dateObject = new Date(timestamp);
  //   let hours = dateObject.getHours();
  //   let minutes = dateObject.getMinutes();
  //   return (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);
  // }

  // const getDateFromDateString = (dateValue) => {
  //   let dateData = dateValue.split('-').map(d => parseInt(d, 10));
  //   if(dateData.length < 3) return null;
  //   let year = dateData[0];
  //   let month = dateData[1];
  //   let date = dateData[2];
  //   return {year, month, date};
  // }

  const getMonthStr = (month) => {
    return monthMap[Math.max(Math.min(11, month), 0)] || 'Month'
  }

  const getDayDetails = (args) => {
    let date = args.index - args.firstDay;
    let day = args.index % 7;
    let prevMonth = args.month - 1;
    let prevYear = args.year;
    if(prevMonth < 0) {
        prevMonth = 11;
        prevYear--;
    }
    let prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth);
    let _date = (date < 0 ? prevMonthNumberOfDays + date : date % args.numberOfDays) + 1;
    let month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
    let timestamp = new Date(args.year, args.month, _date).getTime();
    return {
        date: _date,
        day,
        month,
        timestamp,
        dayString: daysMap[day]
    }
  }

  const getNumberOfDays = (year, month) => {
    return 40 - new Date(year, month, 40).getDate();
  }

  const getMonthDetails = (year, month) => {
    let firstDay = (new Date(year, month)).getDay();
    let numberOfDays = getNumberOfDays(year, month);
    let monthArray = [];
    let rows = 6;
    let currentDay = null;
    let index = 1;
    let cols = 7;

    for(let row = 0; row < rows; row++) {
        for(let col=0; col<cols; col++) {
            currentDay = getDayDetails({
                index,
                numberOfDays,
                firstDay,
                year,
                month
            });
            monthArray.push(currentDay);
            index++;
        }
    }
    return monthArray;
  }

  const isCurrentDay = (day) => {

    return day.timestamp === todayTimestamp;
  }

  const isSelectedDay = (day) => {
    let hour = new Date(selectedDay).getHours() * 60 * 60 * 1000
    let minutes = new Date(selectedDay).getMinutes() * 60 * 1000
    let diff = hour + minutes
    return day.timestamp === selectedDay - diff;
  }

  const setDate = (dateData) => {
    let selectedDay = new Date(dateData.year, dateData.month - 1, dateData.date).getTime();
    setSelectedDay(selectedDay)
  }

  // const updateDateFromInput = () => {
  //   console.log('changed')
  //   let dateValue = inputRef.current.value;
  //   let dateData = getDateFromDateString(dateValue);
  //   if(dateData !== null) {
  //     setDate(dateData);
  //     setYear(dateData.year)
  //     setMonth(dateData.month-1)
  //     setMonthDetails(getMonthDetails(dateData.year, dateData.month-1))
  //   }
  // }

  const onDateClick = (day) => {
    setSelectedDay(day.timestamp)
    setDateToInput(day.timestamp)
    let hours = time.split(':')[0]
    let minutes = time.split(':')[1]
    let newDate = new Date(day.timestamp)
    newDate.setHours(hours)
    newDate.setMinutes(minutes)
    setCalendarState(prevState => ({
      ...prevState,
      [dateValueKey]: newDate
    }))
  }

  const onHourClick = (hour) => {
    setTime(hour)
    setTimeToInput(hour)
  }

  const setYearFunc = (offset) => {
    let yearLocal = year + offset;
    let monthLocal = month;
    setYear(yearLocal)
    setMonthDetails(getMonthDetails(yearLocal, monthLocal))
  }

  const setMonthFunc = (offset) => {
    let yearLocal = year;
    let monthLocal = month + offset;
    if(monthLocal === -1) {
      monthLocal = 11;
      yearLocal--;
    } else if(monthLocal === 12) {
      monthLocal = 0;
      yearLocal++;
    }
    setYear(yearLocal)
    setMonth(monthLocal)
    setMonthDetails(getMonthDetails(yearLocal, monthLocal))
  }

  const renderCalendar = () => {
    let days = monthDetails.map((day, index)=> {
      return (
        <div className={'c-day-container ' + (day.month !== 0 ? ' disabled' : '') +
          (isCurrentDay(day) ? ' highlight' : '') + (isSelectedDay(day) ? ' highlight-green' : '')} key={index}>
          <div className='cdc-day'>
            <span onClick={()=> onDateClick(day)}>
              {day.date}
            </span>
          </div>
        </div>
      )
    })

    return (
      <div className='c-container'>
        <div className='cc-head'>
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d,i) => <div key={i} className='cch-name'>{d}</div>)}
        </div>
        <div className='cc-body'>
          {days}
        </div>
      </div>
    )
  }

  const renderHoursList = () => {
    let hours = generateHours().map((hour, index)=> {
      return (
        <li className='' key={index} onClick={() => onHourClick(hour)}>
          {hour}
        </li>
      )
    })

    return (
      <ul className='c-container hours-picker-conteiner'>
        {hours}
      </ul>
    )
  }

  return (
    <div className={className} ref={elementRef}>
      <input
        className={inputType === 'date' ? 'mdp-input-date' : 'mdp-input-datetime' }
        type={inputType}
        onClick={(e)=> {
          e.preventDefault()
          setShowDatePicker(true)}
        }
        ref={inputRef}
        label={inputLabel}
        id={inputId}
        required={true}
      />
      <label
        className="label"
        id={labelId}
        htmlFor={inputLabel}>
          {labelText}
      </label>
      {showDatePicker ? (
        <div className='mdp-container'>
          <div className='mdp-wrapper'>
            <div className='mdpc-head'>
              <div className='mdpch-button'>
                <div className='mdpchb-inner' onClick={()=> setYearFunc(-1)}>
                  <span className='mdpchbi-left-arrows'></span>
                </div>
              </div>
              <div className='mdpch-button'>
                <div className='mdpchb-inner' onClick={()=> setMonthFunc(-1)}>
                  <span className='mdpchbi-left-arrow'></span>
                </div>
              </div>
              <div className='mdpch-container'>
                <div className='mdpchc-year'>{year}</div>
                <div className='mdpchc-month'>{getMonthStr(month)}</div>
              </div>
              <div className='mdpch-button'>
                <div className='mdpchb-inner' onClick={()=> setMonthFunc(1)}>
                  <span className='mdpchbi-right-arrow'></span>
                </div>
              </div>
              <div className='mdpch-button' onClick={()=> setYearFunc(1)}>
                <div className='mdpchb-inner'>
                  <span className='mdpchbi-right-arrows'></span>
                </div>
              </div>
            </div>
            <div className='mdpc-body'>
              {renderCalendar()}
            </div>
          </div>
          {inputType === 'datetime-local' ?
          <div className='hours-picker-wrapper'>
            {renderHoursList()}
          </div> :
          ''
          }
        </div>
      ) : ''}
    </div>
  )
}
