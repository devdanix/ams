import { gql } from '@apollo/client'

export const GET_EVENTS = gql`
query allEvents{
  allEvents{
    id
    title
    allDay
    start
    end
    userFK {
      id,
      username
    }
    companyFK {
      id,
      name
    }
  }
}
`;


export const USER_EVENTS = gql`
query allUserEvents($userID: Int!){
  userEvents(id:$userID){
    id
    title
    allDay
    start
    end
    userFK {
      id,
      username
    }
    companyFK {
      id,
      name
    }
  }
}
`

export const USER_EVENTS_THIS_WEEK = gql`
query allUserEventsThisWeek($userID: Int!){
  userEventsThisWeek(id:$userID){
    id
    }
  }
`

export const USER_EVENTS_NEXT_WEEK = gql`
query allUserEventsNextWeek($userID: Int!){
  userEventsNextWeek(id:$userID){
    id
    }
  }
`

