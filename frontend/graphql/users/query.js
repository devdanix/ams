import { gql } from '@apollo/client'

export const GET_SINGLE_USER = gql`
query users($username:String){
  users(username:$username) {
    edges {
      node {
        id,
        pk,
        username,
        archived,
        verified,
        email,
        secondaryEmail,
      }
    }
  }
}
`;


export const GET_SINGLE_USER_BY_ID = gql`
query singleUser($id: Int){
  singleUser(id: $id){
    id,
    username,
    firstName,
    lastName
    email
    image
  }
}
`;


export const GET_CURRENT_USER = gql`
query me{
  me{
    pk,
    username,
    firstName,
    lastName,
    email,
  }
}
`;







// export const GET_SINGLE_USER = gql`
// query users($username:String){
//   users(username:$username, status_Verified: true) {
//     edges {
//       node {
//         id,
//         username,
//         archived,
//         verified,
//         email,
//         secondaryEmail,
//       }
//     }
//   }
// }
// `;
