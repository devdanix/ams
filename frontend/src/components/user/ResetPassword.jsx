import React, { useState } from 'react';
import { v4 } from 'uuid';

// Graphql
import { SEND_PASSWORD_RESET_EMAIL, PASSWORD_RESET } from '../../../graphql/users/mutation';

// Hooks
import { useNotification } from '../../../graphql/hooks/useNotification'
import { useCleanMutation } from '../../../graphql/hooks/useCleanMutation';

// Components
import Loader from '../Loader.jsx';


export default function ResetPassword() {

  const token = window.location.pathname.split('/')[2]

  const [ state, setState ] = useState(token ? {token: token} : '')
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

  const sendResetPasswordEmail = useCleanMutation(SEND_PASSWORD_RESET_EMAIL, {
    onCompleted(data) {
      if (data.sendPasswordResetEmail.errors) {
        setErrors(data.sendPasswordResetEmail.errors)
        document.getElementsByTagName('button')[0].lastChild.textContent = 'Register'
        document.getElementById('loader').style.display = 'none'
        return false
      }
      document.getElementsByTagName('button')[0].lastChild.textContent = ''
      document.getElementById('loader').style.display = 'flex'
      const extraClass = "notification-success"
      const title = "Reset Password Email"
      const message = 'An email with the password reset link has been sent to the email address.'
      useNotification(extraClass, title, message)
      setTimeout(() => {
        window.location.replace("/")
      }
      , 5000)
    },
    onError(error){
      const extraClass = "notification-error"
      const title = "No valid credentials"
      const message = "Please enter a valid username and password."
      useNotification(extraClass, title, message)
    }
  });

  const passwordReset = useCleanMutation(PASSWORD_RESET, {
    onCompleted(data) {
      if (data.passwordReset.errors) {
        setErrors(data.passwordReset.errors)
        document.getElementsByTagName('button')[0].lastChild.textContent = 'Register'
        document.getElementById('loader').style.display = 'none'
        return false
      }
      document.getElementsByTagName('button')[0].lastChild.textContent = ''
      document.getElementById('loader').style.display = 'flex'
      const extraClass = "notification-success"
      const title = "Reset Password Success"
      const message = 'Your password has been resetted correctly.'
      useNotification(extraClass, title, message)
      setTimeout(() => {
        window.location.replace("/")
      }
      , 5000)
    },
    onError(error){
      const extraClass = "notification-error"
      const title = "Expired Token"
      const message = "Please resend the reset password email."
      useNotification(extraClass, title, message)
    }
  });

  const showLoader = () => {
    document.getElementsByTagName('button')[0].lastChild.textContent = ''
    document.getElementById('loader').style.display = 'flex'
    if (!token) {
      sendResetPasswordEmail({ email: state.email })
    } else {
      passwordReset({ token: state.token, newPassword1: state.password, newPassword2: state.password2 })
    }
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
        <h2 className='form-title'>Password Reset</h2>
        {!token ?
        <>
          <p>Please insert your email.</p>
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
          <button
            className='btn login-btn centered w-100'
            onClick={(e) => {
              e.preventDefault()
              showLoader({ email: state.email })}
            }
            disabled={!state.email ? true : false}
          >
            <Loader />
            Send Link
          </button>
        </>
        :
        <>
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
            {errors ? showErrors('newPassword2') : ''}
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
            {errors ? showErrors('newPassword2') : ''}
          </div>
          <button
            className='btn login-btn centered w-100'
            onClick={(e) => {
              e.preventDefault()
              showLoader({ token: state.token, newPassword1: state.password, newPassword2: state.password2  })}
            }
            disabled={!state.password || !state.password2 ? true : false}
          >
            <Loader />
            Reset Password
          </button>
        </>
        }
      </form>
    </div>
  )
}
