import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom';
import { useQuery, useMutation } from '@apollo/client'
import { v4 as uuidv4 } from 'uuid';

// Fullcalendar
import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for selectable

// Components
import TopNavbar from './TopNavbar.jsx'
import ModalWindow from './ModalWindow.jsx'
import DatePicker from './DatePicker.jsx';
import Button from './Button.jsx';

// Graphql
import { GET_EVENTS, USER_EVENTS } from '../../graphql/events/query';
import { UPDATE_EVENT, ADD_EVENT } from '../../graphql/events/mutation';

export default function Calendar({
  setUserToken = f => f,
  userID = ''
}) {

  const [ state, setState ] = useState({
    allDay: false
  })

  // let handleColor = (time) => {
  //   return time.getHours() > 12 ? "text-success" : "text-error";
  // };


  const [ updateEventMutation ] = useMutation(UPDATE_EVENT)
  const [ addEventMutation ] = useMutation(ADD_EVENT, {
    onCompleted(data) {
      console.log(data)
    },
    onError(error) {
      console.log(error)
    }
  })

  const renderModalWindow = (info) => {
    document.getElementById('modalWindow').style.display = 'block'
  }

  const closeModalWindow = () => {
    setState('')
    document.getElementById('modalWindow').style.display = 'none'
  }


  // const addNewEventModal = (info, func) => {
  //   const elem = document.querySelector('#modalWindowContainer');
  //   let infoParam = info
  //   ReactDOM.render(
  //     <ModalWindow
  //       showCloseBtn={true}
  //       clearForm=''
  //       buttonLabel=''
  //     >
  //       {/* {func ? func(infoParam) : ''} */}
  //       <form id="form-add-event" className="form-wrapper centered">
  //         <h2 className='form-title'>Add New Event</h2>
  //         <div className='entry-wrapper relative'>
  //           <input
  //             onChange={handleOnChange}
  //             label='title'
  //             id='title'
  //             type='text'
  //           />
  //           <label
  //             className="label"
  //             id='title-label'
  //             htmlFor='title'>
  //               Title
  //             </label>
  //         </div>
  //         <div className='entry-wrapper relative'>
  //         <DatePicker
  //             inputType='datetime-local'
  //             inputLabel='startDate'
  //             inputId='startDate'
  //             labelId='startDate-label'
  //             labelText='Start Date'
  //             dateToSet={info.start}
  //           />
  //         </div>
  //         <div className='entry-wrapper relative'>
  //           <DatePicker
  //             inputType='datetime-local'
  //             inputLabel='endDate'
  //             inputId='endDate'
  //             labelId='endDate-label'
  //             labelText='End Date'
  //             dateToSet={info.end}
  //           />
  //         </div>

  //         <Button
  //           className='btn login-btn centered'
  //           label='Add Event'
  //           function={addEventMutation}
  //           variables={['title', 'allDay', 'start', 'end', 'userID']}
  //           param= {{ variables: { title: state.title, allDay: false, start: info.startStr, end: info.endStr, userID: 1 }}}
  //           // param= {{ variables: { title: 'test', allDay: false, start: info.startStr, end: info.endStr, userID: 1 }}}
  //           iconClassName=""
  //           icon=''
  //           // disabled={!state.username || !state.password ? true : false}
  //         />
  //     </form>
  //   </ModalWindow>
  //     , elem);
  // }

  const unmountWindow = () => {
    const elem = document.querySelector('#modalWindowContainer');
    ReactDOM.unmountComponentAtNode(elem)
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

  // const addNewEventForm = (info) => {
  //   return (
  //     <form id="form-add-event" className="form-wrapper centered">
  //       <h2 className='form-title'>Add New Event</h2>
  //       <div className='entry-wrapper relative'>
  //         <input
  //           onChange={handleOnChange}
  //           label='title'
  //           id='title'
  //           type='text'
  //         />
  //         <label
  //           className="label"
  //           id='title-label'
  //           htmlFor='title'>
  //             Title
  //           </label>
  //       </div>
  //       <div className='entry-wrapper relative'>
  //        <DatePicker
  //           inputType='datetime-local'
  //           inputLabel='startDate'
  //           inputId='startDate'
  //           labelId='startDate-label'
  //           labelText='Start Date'
  //           dateToSet={info.start}
  //         />
  //       </div>
  //       <div className='entry-wrapper relative'>
  //         <DatePicker
  //           inputType='datetime-local'
  //           inputLabel='endDate'
  //           inputId='endDate'
  //           labelId='endDate-label'
  //           labelText='End Date'
  //           dateToSet={info.end}
  //         />
  //       </div>

  //       {/* <Button
  //         className='btn login-btn centered'
  //         label='Login'
  //         function={getToken}
  //         variables={['username', 'password']}
  //         param= {{ variables: { username: state.username, password: state.password }}}
  //         iconClassName=""
  //         icon=''
  //         disabled={!state.username || !state.password ? true : false}
  //       /> */}
  //     </form>
  //   )
  // }


  // const { loading, error, data } = useQuery(USER_EVENTS, {
  //   variables: { userID: userID }

  // });


  // const { loading, error, data } = useQuery(GET_EVENTS);

  // if (loading) return 'Loading...';
  // if (error) return `Error! ${error.message}`;

console.log(state)
  return (
    <div className="wrapper">
      <TopNavbar viewTitle={'Calendar'} setUserToken={setUserToken}/>
      <div id="calendar" className="mt w-95 centered">
      {/* <div id="modalWindowContainer" /> */}
        {state.startDate && state.endDate ?
        <div id="modalWindow" className="modal">
        <div className="modal-content">
          <span className="close" onClick={() =>  closeModalWindow()}>&times;</span> :
          <form id="form-add-event" className="form-wrapper centered">
            <h2 className='form-title'>Add New Event</h2>
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
            <div className='entry-wrapper relative'>
            <DatePicker
              inputType='datetime-local'
              inputLabel='startDate'
              inputId='startDate'
              labelId='startDate-label'
              labelText='Start Date'
              dateToSet={state.startDate}
            />
            </div>
            <div className='entry-wrapper relative'>
              <DatePicker
                inputType='datetime-local'
                inputLabel='endDate'
                inputId='endDate'
                labelId='endDate-label'
                labelText='End Date'
                dateToSet={state.endDate}
              />
            </div>
            <Button
              className='btn login-btn centered'
              label='Add Event'
              function={addEventMutation}
              variables={['title', 'allDay', 'start', 'end', 'userID']}
              // param= {{ variables: { title: state.title, allDay: false, start: info.startStr, end: info.endStr, userID: 1 }}}
              param= {{ variables: { title: state.title, allDay: false, start: state.startDate.toISOString(), end: state.endDate.toISOString(), userID: 1 }}}
              iconClassName=""
              icon=''
              // disabled={!state.username || !state.password ? true : false}
            />
          </form>
        </div>
      </div> : ''
      }
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
          businessHours= {{
            daysOfWeek: [ 1, 2, 3, 4, 5 ], // Monday - Friday
            startTime: '09:00', // a start time (10am in this example)
            endTime: '17:30', // an end time (6pm in this example)
          }}

          // constraint= {"businessHours"}
          // selectConstraint= {"businessHours"}
          // events={data.userEvents}
          events={[
            {
              "__typename": "EventType",
              "id": "1",
              "title": "Test Event 1",
              "allDay": false,
              "start": "2022-02-14T14:00:00+00:00",
              "end": "2022-02-14T15:00:00+00:00",
              "userFK": {
                "__typename": "UserType",
                "id": "1",
                "username": "user1"
              }
            },
            {
              "__typename": "EventType",
              "id": "2",
              "title": "Test Event 2",
              "allDay": false,
              "start": "2022-02-15T11:00:00+00:00",
              "end": "2022-02-15T15:00:00+00:00",
              "userFK": {
                "__typename": "UserType",
                "id": "1",
                "username": "user1"
              }
            }
          ]}
          // events={[]}
          select={(info) => {
            // alert('selected ' + info.startStr + ' to ' + info.endStr);
            // addNewEventModal(info, addNewEventForm)
            setState(prevState => ({
              ...prevState,
              startDate: new Date(info.startStr),
              endDate: new Date(info.endStr)
            }));
            console.log(state)
            renderModalWindow(info)
          }}
          // selectOverlap={(event) => {
          //   return event.groupId != 'permission'; //allow overlap if event is not in the "permission" group
          // }}

          eventResize={info => {
            let variables = {
              variables: {
                id: info.event.id,
                title: info.event.title,
                allDay: false,
                start: info.event.start.toISOString(),
                end: info.event.end ? info.event.end.toISOString() : info.event.start.toISOString()
              }
            }
            if(info.event.allDay){
              variables.variables.allDay = true
              info.event.end ? variables.variables.end : variables.variables.end = info.event.start.toISOString()
            }
            updateEventMutation(variables)
          }}
          eventDrop={info => {
            let variables = {
              variables: {
                id: info.event.id,
                title: info.event.title,
                allDay: false,
                start: info.event.start.toISOString(),
                end: info.event.end ? info.event.end.toISOString() : info.event.start.toISOString()
              }
            }
            if(info.event.allDay){
              variables.variables.allDay = true
              info.event.end ? variables.variables.end : variables.variables.end = info.event.start.toISOString()
            } else if (info.event.allDay && info.event.start == info.event.end || !info.event.end) {

              let tempDate = new Date(info.event.start)
              tempDate = tempDate.setHours(info.event.start.getHours() + 1)
              info.event.setEnd(tempDate)
              variables.variables.end = info.event.end.toISOString()
            }
            updateEventMutation(variables)
          }}
          eventClick={info => {

          }}
        />
      </div>
    </div>
  )
}

