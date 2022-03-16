import { gql } from '@apollo/client'

export const UPDATE_EVENT = gql`
  mutation updateEvent($id:ID!, $title:String!, $allDay:Boolean!, $start:DateTime!, $end:DateTime!, $userID: Int!, $companyID: Int ){
    updateEvent(id: $id, title: $title, allDay: $allDay, end: $end, start: $start, userFK: $userID, companyFK: $companyID ){
      event{
        id
        title
        allDay
        start
        end
      }
    }
  }
`;


export const ADD_EVENT = gql`
  mutation addEvent($title: String!, $allDay: Boolean!, $start: DateTime!, $end:DateTime!, $userID: Int!, $companyID: Int){
    addEvent(title: $title, allDay: $allDay, start:$start, end: $end, userFK: $userID, companyFK: $companyID){
      event{
        id
        title
        start
        end
        allDay
        userFK {
          id,
          username
        }
      }
    }
  }
`


export const DELETE_EVENT = gql`
  mutation deleteEvent($id:Int!){
    deleteEvent(id:$id){
      event{
        id
      }
    }
  }
`;