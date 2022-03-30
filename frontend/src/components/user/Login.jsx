import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'

// Graphql
import { LOGIN } from '../../../graphql/users/mutation'

// Hooks
import { useNotification } from '../../../graphql/hooks/useNotification'
import { useCleanMutation } from '../../../graphql/hooks/useCleanMutation';

// Context
import { GlobalContext } from '../context/GlobalProvider'


export default function Login ({
  inputRef = '',
}) {

  const { userToken, userIDContext, isLogin } = useContext(GlobalContext)
  const [ userTokenValue, setUserToken ] = userToken
  const [ userIDValue, setUserIDValue ] = userIDContext
  const [ isLoginValue, setIsLogin ] = isLogin

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

  const getToken = useCleanMutation(LOGIN, {
    onCompleted(data) {
      const userFound = data.tokenAuth.user
      const isVerified = userFound ? data.tokenAuth.user.verified : false
      if(userFound && isVerified) {
        const username = document.getElementById('username').value
        const extraClass = "notification-success"
        const title = "Login"
        const message = `Welcome back ${username}.`
        useNotification(extraClass, title, message)
        setUserIDValue(data.tokenAuth.user.pk)
        setUserToken(data.tokenAuth.token)
        // localStorage.setItem('token', data.tokenAuth.token)
      } else if(!userFound) {
        const extraClass = "notification-error"
        const title = "Account Error"
        const message = "The account has not been found. Please register a new account."
        useNotification(extraClass, title, message)
      } else if(userFound && !isVerified) {
        const extraClass = "notification-error"
        const title = "Account Verification Failed"
        const message = "The account has not been verified yet. Please check your email and activate it."
        useNotification(extraClass, title, message)
      }
    },
    onError(){
      const extraClass = "notification-error"
      const title = "No valid credentials"
      const message = "Please enter a valid username and password."
      useNotification(extraClass, title, message)
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
        <button
          className='btn login-btn centered w-100'
          onClick={(e) => {
            e.preventDefault()
            getToken({ username: state.username, password: state.password })}
          }
          disabled={!state.username || !state.password ? true : false}
        >
          Login
        </button>
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
