import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { v4 as uuidv4 } from 'uuid';

// Custom Hooks
import { useCleanMutation } from '../../graphql/hooks/useCleanMutation.js';

// Fullcalendar
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for selectable

// Components
import TopNavbar from './TopNavbar.jsx'
// import ModalWindow from './ModalWindow.jsx'
import DatePicker from './DatePicker.jsx';
import Button from './Button.jsx';

// Graphql
import { GET_EVENTS, USER_EVENTS } from '../../graphql/events/query';
import { UPDATE_EVENT, ADD_EVENT, DELETE_EVENT } from '../../graphql/events/mutation';


export default function Calendar({
  setUserToken = f => f,
  showNotification = f => f,
  userID = ''
}) {

  const [ state, setState ] = useState({
    allDay: false
  })

  // let handleColor = (time) => {
  //   return time.getHours() > 12 ? "text-success" : "text-error";
  // };

  // Graphql Mutations
  const updateEventMutation = useCleanMutation(UPDATE_EVENT, {
    onCompleted(data) {
      closeModalWindow()
      const extraClass = "notification-success"
      const title = "Update Event"
      const message = `The event has been updated correctly.`
      showNotification(extraClass, title, message)
    },
    onError(error) {
      // console.log(error)
    },
    refetchQueries: [
      USER_EVENTS,
      userID = userID
    ],
  })

  const [ deleteEventMutation ] = useMutation(DELETE_EVENT, {
    onCompleted(data) {
      closeModalWindow()
      const extraClass = "notification-success"
      const title = "Delete Event"
      const message = `The event has been deleted correctly.`
      showNotification(extraClass, title, message)
    },
    onError(error) {
      const extraClass = "notification-error"
      const title = "Delete Event Error"
      const message = `There was an error deleting the event.`
      showNotification(extraClass, title, message)
    },
    refetchQueries: [
      USER_EVENTS,
      userID = userID
    ],
  })

  const [ addEventMutation ] = useMutation(ADD_EVENT, {
    onCompleted(data) {
      closeModalWindow()
      console.log('here')
      const extraClass = "notification-success"
      const title = "Add Event"
      const message = `The new event has been added correctly.`
      showNotification(extraClass, title, message)
    },
    onError(error) {
      const extraClass = "notification-error"
      const title = "Add Event Error"
      const message = `There was an error adding the event.`
      showNotification(extraClass, title, message)
    },
    refetchQueries: [
      USER_EVENTS,
      userID = userID
    ],
  })

  const renderModalWindow = (info, func) => {
    document.getElementById('modalWindow').style.display = 'block'
  }

  const closeModalWindow = () => {
    setState('')
    document.getElementById('modalWindow').style.display = 'none'
  }

  const handleOnChange = (event) => {
    const { id, value } = event.target;
    let inputLabel = `${event.target.id}-label`
    if (event.target.value && event.target.type != 'radio') {
      document.getElementById(inputLabel).classList.add('not-empty')
    } else {
      document.getElementById(inputLabel).classList.remove('not-empty')
    }
    setState(prevState => ({ ...prevState, [id]: value }));
  }

  const handleOnChangeAllDay = () => {
    setState(prevState => ({
       ...prevState,
       allDay: !prevState.allDay
    }));
  }

  const showDropDown = (id) => {
    document.getElementById(id).classList.toggle("show");
  }

  console.log(state)

  const addEventForm = () => {
    if (state.startDate && state.endDate) {
      return (
        <div className="modal-content">
          <span className="close" onClick={() =>  closeModalWindow()}>&times;</span>
          <form id="form-add-event" className="form-wrapper centered">
            <h2 className='form-title'>Add New Event</h2>
            <div className='entry-wrapper relative'>
              <input
                onChange={handleOnChangeAllDay}
                label='allDay'
                id='allDay'
                type='checkbox'
                value={state.allDay}
                checked={state.allDay}
              />
              <label
                className="label"
                id='allDay-label'
                htmlFor='allDay'>
                  All Day
                </label>
            </div>
            <div className='entry-wrapper relative'>
              <input
                onChange={handleOnChange}
                label='title'
                id='title'
                type='text'
              />
              <label
                className="label"
                id='title-label'
                htmlFor='title'>
                  Title
                </label>
            </div>
            <div className='flex jcsb'>
              <DatePicker
                className='entry-wrapper relative datepicker-form-width'
                inputType={state.allDay ? 'date' : 'datetime-local'}
                inputLabel='startDate'
                inputId='startDate'
                labelId='startDate-label'
                labelText='Start Date'
                dateToSet={state.startDate}
                setCalendarState={setState}
                dateValueKey = 'startDate'
                allDay={state.allDay}
              />
              <div className='entry-wrapper relative datepicker-form-width'>
                <DatePicker
                  className=''
                  inputType={state.allDay ? 'date' : 'datetime-local'}
                  inputLabel='endDate'
                  inputId='endDate'
                  labelId='endDate-label'
                  labelText='End Date'
                  dateToSet={state.endDate}
                  setCalendarState={setState}
                  dateValueKey = 'endDate'
                  allDay={state.allDay}
                />
                {state.startDate > state.endDate ?
                <ul className='form-errors-list'>
                  <li>Event must end after it starts.</li>
                </ul> : ''
                }
              </div>
            </div>
            <div>
              {/* <Button
                className='btn login-btn centered'
                label='Add Event'
                function={addEventMutation}
                variables={['title', 'allDay', 'start', 'end', 'userID']}
                param= {{ variables: { title: state.title, allDay: state.allDay, start: state.startDate.toISOString(), end: state.endDate.toISOString(), userID: userID }}}
                iconClassName=""
                icon=''
                disabled={!state.title || state.startDate > state.endDate ? true : false}
              /> */}
              <button
                className='btn login-btn centered w-100'
                onClick={(e) => {
                  e.preventDefault()
                  addEventMutation({
                    title: state.title,
                    allDay: state.allDay,
                    start: state.startDate.toISOString(),
                    end: state.endDate.toISOString(),
                    userID: userID
                  })}
                }
                disabled={!state.title || state.startDate > state.endDate ? true : false}
                >
                  Add Event
              </button>
            </div>
          </form>
        </div>
      )
    }
  }

  const clickEventForm = () => {
    return (
      <div className="modal-content">
        <span className="close" onClick={() =>  closeModalWindow()}>&times;</span>
        <form id="form-add-event" className="form-wrapper centered">
          <h2 className='form-title'>Manage Event</h2>
          <div className='entry-wrapper relative'>
            <input
              onChange={handleOnChangeAllDay}
              label='allDay'
              id='allDay'
              type='checkbox'
              value={state.allDay}
              checked={state.allDay}
            />
            <label
              className="label"
              id='allDay-label'
              htmlFor='allDay'>
                All Day
            </label>
          </div>
          <div className='entry-wrapper relative'>
            <input
              onChange={handleOnChange}
              label='title'
              id='title'
              type='text'
              value={state.title}
            />
            <label
              className="label not-empty"
              id='title-label'
              htmlFor='title'>
                Title
            </label>
          </div>
          <div className='flex jcsb'>
            <DatePicker
              className='entry-wrapper relative datepicker-form-width'
              inputType={state.allDay ? 'date' : 'datetime-local'}
              inputLabel='startDate'
              inputId='startDate'
              labelId='startDate-label'
              labelText='Start Date'
              dateToSet={state.startDate}
              setCalendarState={setState}
              dateValueKey = 'startDate'
              allDay={state.allDay}
            />
            <div className='entry-wrapper relative datepicker-form-width'>
              <DatePicker
                className=''
                inputType={state.allDay ? 'date' : 'datetime-local'}
                inputLabel='endDate'
                inputId='endDate'
                labelId='endDate-label'
                labelText='End Date'
                dateToSet={state.endDate}
                setCalendarState={setState}
                dateValueKey = 'endDate'
                allDay={state.allDay}
              />
              {state.startDate > state.endDate ?
              <ul className='form-errors-list'>
                <li>Event must end after it starts.</li>
              </ul> : ''
              }
            </div>
          </div>
          <div className='flex jcsb'>
            <div className="dropdown" style={{width:'40%'}}>
              <Button
                function={showDropDown}
                label='Cancel Event'
                funcParam='cancelEventDropdown'
                className="btn login-btn centered w-100"
                iconClassName=''
                icon=''
                variables=''
                param=''
              />
              <div className="dropdown-content dropdown-content-event" id={'cancelEventDropdown'}>
                <p>Are you sure you want to delete this event?</p>
                <div className='flex'>
                  <Button
                    className='btn dropdown-button cancel-btn login-btn centered w-100'
                    label='Yes'
                    function={deleteEventMutation}
                    variables={['id']}
                    param= {{ variables: { id: state.eventID }}}
                    iconClassName=""
                    icon=''
                    style={{width: '50%'}}
                  />
                  <Button
                    className='btn dropdown-button no-btn login-btn centered w-100'
                    label='No'
                    function={() => document.getElementById('cancelEventDropdown').classList.remove("show")}
                    variables=''
                    param= ''
                    iconClassName=""
                    icon=''
                    style={{width: '50%'}}
                  />
                </div>
              </div>
            </div>
              <button
                className='btn login-btn w-40'
                onClick={(e) => {
                  e.preventDefault()
                  updateEventMutation({
                    id: state.eventID,
                    title: state.title,
                    allDay: state.allDay,
                    start: state.startDate.toISOString(),
                    end: state.endDate.toISOString(),
                    userID: userID
                  })}
                }
                disabled={!state.title || state.startDate > state.endDate ? true : false}
                >
                  Ok
              </button>
          </div>
        </form>
      </div>
    )
  }

  // const { loading, error, data } = useQuery(USER_EVENTS, {
  //   variables: { userID: userID }
  // });

  const { loading, error, data } = useQuery(USER_EVENTS, {
    variables: { userID: 1 }
  });

  // const { loading, error, data } = useQuery(GET_EVENTS);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <div className="wrapper">
      <TopNavbar viewTitle={'Calendar'} setUserToken={setUserToken}/>
      <div id="calendar" className="mt w-95 centered">
        <div id="modalWindow" className="modal">
          {state.onSelectEvent ? addEventForm() : ''}
          {state.onClickEvent ? clickEventForm() : ''}
        </div>
        <FullCalendar
          plugins= {[ timeGridPlugin, dayGridPlugin, interactionPlugin  ]}
          initialView= 'timeGridWeek'
          selectable={true}
          editable= {true}
          nowIndicator={true}
          aspectRatio={2.3}
          firstDay={1}
          scrollTime={'08:00:00'}
          // eventColor='#378006'
          eventDisplay='block'
          headerToolbar= {{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          minTime= "08:00:00"
          businessHours= {{
            daysOfWeek: [ 1, 2, 3, 4, 5 ], // Monday - Friday
            startTime: '09:00', // a start time (10am in this example)
            endTime: '17:30', // an end time (6pm in this example)
          }}
          // selectConstraint= {"businessHours"}
          events={data.userEvents}
          // events={[
          //   {
          //     "__typename": "EventType",
          //     "id": "1",
          //     "title": "Test Event 1",
          //     "allDay": false,
          //     "start": "2022-02-14T14:00:00+00:00",
          //     "end": "2022-02-14T15:00:00+00:00",
          //     "userFK": {
          //       "__typename": "UserType",
          //       "id": "1",
          //       "username": "user1"
          //     }
          //   },
          //   {
          //     "__typename": "EventType",
          //     "id": "2",
          //     "title": "Test Event 2",
          //     "allDay": false,
          //     "start": "2022-02-15T11:00:00+00:00",
          //     "end": "2022-02-15T15:00:00+00:00",
          //     "userFK": {
          //       "__typename": "UserType",
          //       "id": "1",
          //       "username": "user1"
          //     }
          //   }
          // ]}
          select={(info) => {
            setState(prevState => ({
              ...prevState,
              allDay: info.allDay,
              startDate: new Date(info.startStr),
              endDate: new Date(info.endStr),
              onSelectEvent: true
            }));
            renderModalWindow(info)
          }}
          eventResize={info => {
            let variables = {
                id: info.event.id,
                title: info.event.title,
                allDay: false,
                start: info.event.start.toISOString(),
                end: info.event.end ? info.event.end.toISOString() : info.event.start.toISOString()
            }
            if(info.event.allDay){
              variables.allDay = true
              info.event.end ? variables.end : variables.end = info.event.start.toISOString()
            }
            updateEventMutation(variables)
          }}
          eventDrop={info => {
            let variables = {
                id: info.event.id,
                title: info.event.title,
                allDay: false,
                start: info.event.start.toISOString(),
                end: info.event.end ? info.event.end.toISOString() : info.event.start.toISOString()
            }
            if(info.event.allDay){
              variables.allDay = true
              info.event.end ? variables.end : variables.end = info.event.start.toISOString()
            } else if (info.event.allDay && info.event.start == info.event.end || !info.event.end) {

              let tempDate = new Date(info.event.start)
              tempDate = tempDate.setHours(info.event.start.getHours() + 1)
              info.event.setEnd(tempDate)
              variables.end = info.event.end.toISOString()
            }
            updateEventMutation(variables)
          }}
          eventClick={info => {
            setState(prevState => ({
              ...prevState,
              allDay: info.event._def.allDay,
              title: info.event._def.title,
              eventID: info.event._def.publicId,
              startDate: new Date(info.event._instance.range.start.toISOString()),
              endDate: new Date(info.event._instance.range.end.toISOString()),
              onClickEvent: true
            }));
            renderModalWindow(info)
          }}
        />
      </div>
    </div>
  )
}

