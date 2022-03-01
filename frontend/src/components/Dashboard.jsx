import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client';

// Graphql
import { USER_EVENTS } from '../../graphql/events/query';

// Components
import TopNavbar from './TopNavbar.jsx';

export default function Dashboard({
  userID = '',
  setUserToken = f => f,
}) {

  const [ eventsThisWeek, setEventsThisWeek ] = useState('')

  const { loading, error, data } = useQuery(USER_EVENTS, {
    variables: { userID: userID }
  });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  // data.userEvents.forEach(event => {
  //   let prevDay = new Date(event.end) - 60 * 60 * 24 * 1000
  //   let oneDay = new Date() - prevDay
  //   let todayDay = new Date(event.end).getDay()
  //   let monday = new Date() - (today - 1)
  // })

  console.log(data.userEvents)

  return (
    <div className="wrapper">
      <TopNavbar viewTitle={'Dashboard'} setUserToken={setUserToken}/>
      <div className='events-counter'>
        <p>Events this week: <span>5</span></p>
      </div>
      <div className='events-counter'>
        <p>Events next week: <span>8</span></p>
      </div>
    </div>
  )
}
