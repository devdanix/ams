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
    }
  }
`