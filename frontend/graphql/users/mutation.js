import { gql } from '@apollo/client'

export const LOGIN = gql`
  mutation login($username:String!, $password:String!){
    tokenAuth(username:$username, password:$password) {
      success,
      errors,
      unarchiving,
      token,
      refreshToken,
      unarchiving,
      user {
        id,
        pk,
        username,
        verified,
      }
    }
  }
`


export const VERIFY_ACCOUNT = gql`
  mutation verifyAccount($token:String!){
    verifyAccount(token:$token) {
      success,
      errors
    }
  }
`;


export const REGISTER = gql`
  mutation register($email:String!, $username:String!, $password1:String!, $password2:String!) {
    register(email:$email, username:$username, password1:$password1, password2:$password2) {
      success,
      errors,
      token,
      refreshToken,
    }
  }
`


export const SEND_PASSWORD_RESET_EMAIL = gql`
  mutation sendPasswordResetEmail($email: String!) {
    sendPasswordResetEmail(email: $email) {
      success,
      errors
    }
  }
`


export const PASSWORD_RESET = gql`
  mutation passwordReset($token:String!, $newPassword1: String!, $newPassword2: String!){
    passwordReset(
      token: $token,
      newPassword1: $newPassword1,
      newPassword2: $newPassword2
    ) {
      success,
      errors
    }
  }
`
export const UPDATE_USER = gql`
  mutation updateUser($userID:Int, $username:String, $email:String, $firstName:String, $lastName:String ){
    userUpdate(userID:$userID, username:$username, email:$email, firstName:$firstName, lastName:$lastName){
      errors,
      user{
        pk,
        username,
        email
        lastName
        firstName
      }
    }
  }
`