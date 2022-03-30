import React, { useContext } from 'react'
import { useQuery } from '@apollo/client';

// Graphql
import { USER_EVENTS_THIS_WEEK, USER_EVENTS_NEXT_WEEK } from '../../graphql/events/query';

// Context
import { GlobalContext } from './context/GlobalProvider';

// Components
import TopNavbar from './TopNavbar.jsx';

export default function Dashboard() {

  const { userIDContext } = useContext(GlobalContext)
  const [ userIDValue, setUserIDValue ] = userIDContext

  const {
    loading: loadingThisWeekQueryLoading,
    error: errorThisWeekQueryError,
    data: dataThisWeek
  } = useQuery(USER_EVENTS_THIS_WEEK, {variables: { userID: userIDValue || 1 }});

  const {
    loading: loadingNextWeekQueryLoading,
    error: errorNextWeekQueryError,
    data: dataNextWeek
  } = useQuery(USER_EVENTS_NEXT_WEEK, {variables: { userID: userIDValue || 1 }});

  if (loadingThisWeekQueryLoading || loadingNextWeekQueryLoading ) return 'Loading...';
  if (errorThisWeekQueryError) return `Error! ${errorThisWeekQueryError.message}`;
  if (errorNextWeekQueryError) return `Error! ${errorNextWeekQueryError.message}`;

  return (
    <div className="wrapper">
      <TopNavbar viewTitle={'Dashboard'} />
      <div className='events-counter'>
        <p>Events this week: <span>{dataThisWeek.userEventsThisWeek.length}</span></p>
      </div>
      <div className='events-counter'>
        <p>Events next week: <span>{dataNextWeek.userEventsNextWeek.length}</span></p>
      </div>
    </div>
  )
}
