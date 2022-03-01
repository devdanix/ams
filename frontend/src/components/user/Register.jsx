import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { v4 } from 'uuid';

// Graphql
import { REGISTER } from '../../../graphql/users/mutation'

// Components
import Button from '../Button.jsx'
import Loader from '../Loader.jsx';

export default function Register({
  setIsLogin = f => f,
  showNotification = f => f,
}) {

  const [ state, setState ] = useState('')
  const [ errors, setErrors ] = useState('')

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

  const [ register ] = useMutation(REGISTER, {
    onCompleted(data) {
      if (data.register.errors) {
        setErrors(data.register.errors)
        document.getElementsByTagName('button')[0].lastChild.textContent = 'Register'
        document.getElementById('loader').style.display = 'none'
        return false
      }
      document.getElementsByTagName('button')[0].lastChild.textContent = ''
      document.getElementById('loader').style.display = 'flex'
      const extraClass = "notification-success"
      const title = "Registration Success"
      const message = 'Your account has been created, please activate it before log in.'
      showNotification(extraClass, title, message)
      setTimeout(() => {
        window.location.replace("/")
      }
      , 5000)
    },
    onError(error){
      const extraClass = "notification-error"
      const title = "No valid credentials"
      const message = "Please enter a valid username and password."
      showNotification(extraClass, title, message)

    }
  });

  const showLoader = () => {
    document.getElementsByTagName('button')[0].lastChild.textContent = ''
    document.getElementById('loader').style.display = 'flex'
    register({ variables: { email: state.email, username: state.username, password1: state.password, password2: state.password2 }})
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

  return (
    <div className='w-100'>
      <form id="form-login" className="form-wrapper centered">
        <h2 className='form-title'>Register</h2>
        <div className='entry-wrapper relative'>
          <input
            onChange={handleOnChange}
            label='email'
            id='email'
            type='text'
          />
          <label
            className="label"
            id='email-label'
            htmlFor='email'>
              Email
          </label>
          {errors ? showErrors('email') : ''}
        </div>
        <div className='entry-wrapper relative'>
          <input
            onChange={handleOnChange}
            label='user'
            id='username'
            type='text'
          />
          <label
            className="label"
            id='username-label'
            htmlFor='username'>
              Username
          </label>
          {errors ? showErrors('username') : ''}
        </div>
        <div className='entry-wrapper relative'>
          <input
            onChange={handleOnChange}
            label='password'
            id='password'
            type='password'
          />
          <label
            className="label"
            id='password-label'
            htmlFor='password'>
              Password
          </label>
          {errors ? showErrors('password2') : ''}
        </div>
        <div className='entry-wrapper relative'>
          <input
            onChange={handleOnChange}
            label='password2'
            id='password2'
            type='password'
          />
          <label
            className="label"
            id='password2-label'
            htmlFor='password2'>
              Confirm Password
          </label>
          {errors ? showErrors('password2') : ''}
        </div>
        <Button
          className='btn login-btn centered w-100'
          label='Register'
          function={showLoader}
          variables={['email', 'username', 'password1', 'password2']}
          param= {{ variables: { email: state.email, username: state.username, password1: state.password, password2: state.password2 }}}
          iconClassName=""
          icon=''
          disabled={!state.email || !state.username || !state.password || !state.password2 ? true : false}
        >
        <Loader />
        </Button>
        <div className='mt'>
          <Link onClick={() => setIsLogin(true)} to="/">Log in</Link>
        </div>
      </form>
    </div>
  )
}
