import React, { useState, useContext } from 'react'
import { useQuery } from '@apollo/client';
import { v4 } from 'uuid';

// Components
import Upload from '../components/Upload.jsx'
import TopNavbar from './TopNavbar.jsx';

// Graphql
import { GET_SINGLE_USER_BY_ID } from '../../graphql/users/query'
import { UPDATE_USER } from '../../graphql/users/mutation'

// Custom Hooks
import { useCleanMutation } from '../../graphql/hooks/useCleanMutation.js';
import { useNotification } from '../../graphql/hooks/useNotification.js';

// Context
import { GlobalContext } from './context/GlobalProvider.js';

export default function Profile() {

  const { userIDContext } = useContext(GlobalContext)
  const [ userIDValue, setUserIDValue ] = userIDContext

  const [ state, setState ] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
  })

  const [ errors, setErrors ] = useState('')

  // Graphql Mutations
  const updateUserMutation = useCleanMutation(UPDATE_USER, {
    onCompleted(data) {
      if(data.userUpdate.errors) {
        setErrors(data.userUpdate.errors)
        return false
      }
      const extraClass = "notification-success"
      const title = "Update Account"
      const message = `Your account has been updated correctly.`
      useNotification(extraClass, title, message)
    },
    onError(error) {
      const extraClass = "notification-error"
      const title = "Update Account"
      const message = `Has not been possible to update your account due to the highlighted errors.`
      useNotification(extraClass, title, message)
    },
    refetchQueries: [
      {
        query: GET_SINGLE_USER_BY_ID,
        variables: {userID: userIDValue}
      }
    ],
  })

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

  const showErrors = (type) => {
    let errorsResult = ''
    if( errors[type]) {
      errorsResult = errors[type].map(error => {
        return <li key={v4()}>{error.message}</li>
      })
    }
    return (
      <ul className='form-errors-list'>
        {errorsResult}
      </ul>
    )
  }

  const { loading, error, data } = useQuery(GET_SINGLE_USER_BY_ID, {
    variables: {
      id: userIDValue || 1
    },
    onCompleted(data) {
      setState({
        userID: userIDValue || 1 ,
        username: data.singleUser.username,
        firstName: data.singleUser.firstName,
        lastName: data.singleUser.lastName,
        email: data.singleUser.email,
      })
    },
  });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  return (
    <div className="wrapper">
      <TopNavbar viewTitle='Profile' />
        <div className='w-100'>
        <form id="form-profile" className="form-wrapper centered">
          <div className='entry-wrapper relative'>
            <input
              onChange={handleOnChange}
              label='user'
              id='username'
              type='text'
              value={state.username}
            />
            <label
              className="label not-empty"
              id='username-label'
              htmlFor='username'>
                Username
            </label>
            {errors ? showErrors('username') : ''}
          </div>
          <div className='flex jcsb'>
            <div className='entry-wrapper relative profile-field'>
              <input
                onChange={handleOnChange}
                label='firstName'
                id='firstName'
                type='text'
                value={state.firstName}
              />
              <label
                className="label not-empty"
                id='firstName-label'
                htmlFor='firstName'>
                  First Name
              </label>
              {errors ? showErrors('firstName') : ''}
            </div>
            <div className='entry-wrapper relative profile-field'>
              <input
                onChange={handleOnChange}
                label='lastName'
                id='lastName'
                type='text'
                value={state.lastName}
              />
              <label
                className="label not-empty"
                id='lastName-label'
                htmlFor='lastName'>
                  Last Name
              </label>
              {errors ? showErrors('lastName') : ''}
            </div>
          </div>
          <div className='entry-wrapper relative'>
            <input
              onChange={handleOnChange}
              label='email'
              id='email'
              type='text'
              value={state.email}
            />
            <label
              className="label not-empty"
              id='email-label'
              htmlFor='email'>
                Email
            </label>
            {errors ? showErrors('email') : ''}
          </div>
          <div className='flex jcsb mb-x2'>
            <img className='user-img' src={data.singleUser.image ? `media/${data.singleUser.image}` : 'media/default-user-image.png'} />
            <Upload query={GET_SINGLE_USER_BY_ID} queryVariables={{id: userIDValue || 1}} userID={userIDValue || 1}/>
          </div>
          <button
              className='btn login-btn w-30'
              onClick={(e) => {
                e.preventDefault()
                updateUserMutation({
                  userID: userIDValue || 1,
                  username: state.username,
                  email: state.email,
                  firstName: state.firstName,
                  lastName: state.lastName
                })}
              }
              disabled={!state.username || !state.email ? true : false}
            >Update</button>
        </form>
      </div>
    </div>
  )
}
