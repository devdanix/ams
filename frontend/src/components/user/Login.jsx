import React, { useState, useRef } from 'react'
import { useMutation } from '@apollo/client'
import { Link } from 'react-router-dom'

// Graphql
import { LOGIN } from '../../../graphql/users/mutation'

// Components
import Button from '../Button.jsx';


export default function Login ({
  showNotification = f => f,
  setUserToken = f => f,
  setIsLogin = f => f,
  setUserID = f => f,
  inputRef = '',
}) {

  const [ state, setState ] = useState({username: ''})

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

  const [ getToken ] = useMutation(LOGIN, {
    onCompleted(data) {
      const userFound = data.tokenAuth.user
      const isVerified = userFound ? data.tokenAuth.user.verified : false
      if(userFound && isVerified) {
        const username = document.getElementById('username').value
        const extraClass = "notification-success"
        const title = "Login"
        const message = `Welcome back ${username}.`
        showNotification(extraClass, title, message)
        setUserToken(data.tokenAuth.token)
        setUserID(data.tokenAuth.user.pk)
        // localStorage.setItem('token', data.tokenAuth.token)
      } else if(!userFound) {
        const extraClass = "notification-error"
        const title = "Account Error"
        const message = "The account has not been found. Please register a new account."
        showNotification(extraClass, title, message)
      } else if(userFound && !isVerified) {
        const extraClass = "notification-error"
        const title = "Account Verification Failed"
        const message = "The account has not been verified yet. Please check your email and activate it."
        showNotification(extraClass, title, message)
      }
    },
    onError(){
      const extraClass = "notification-error"
      const title = "No valid credentials"
      const message = "Please enter a valid username and password."
      showNotification(extraClass, title, message)
    }
  });

  return (
    <div className='w-100'>
      <form id="form-login" className="form-wrapper centered">
        <h2 className='form-title'>Sign in</h2>
        <div className='entry-wrapper relative'>
          <input
            onChange={handleOnChange}
            label='user'
            id='username'
            type='text'
            ref={inputRef}
          />
          <label
            className="label"
            id='username-label'
            htmlFor='username'>
              Username
            </label>
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
        </div>
        <Button
          className='btn login-btn centered w-100'
          label='Login'
          function={getToken}
          variables={['username', 'password']}
          param= {{ variables: { username: state.username, password: state.password }}}
          iconClassName=""
          icon=''
          disabled={!state.username || !state.password ? true : false}
        />
        <div className='mt-x2'>
          Don't have an account? Register <Link onClick={() => setIsLogin(false)} to="/register">here.</Link>
        </div>
        <div className='mt'>
          <Link onClick={() => setIsLogin(false)} to="/password-reset">Forgotten your password?</Link>
        </div>
      </form>
    </div>
  )
}
