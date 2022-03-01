import React, { useState } from 'react';
import { useMutation } from '@apollo/client'
import { v4 } from 'uuid';


// Graphql
import { SEND_PASSWORD_RESET_EMAIL, PASSWORD_RESET } from '../../../graphql/users/mutation';

// Components
import Button from '../Button.jsx'
import Loader from '../Loader.jsx';

export default function ResetPassword({
  showNotification = f => f,
}) {

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

  const [ sendResetPasswordEmail ] = useMutation(SEND_PASSWORD_RESET_EMAIL, {
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

  const [ passwordReset ] = useMutation(PASSWORD_RESET, {
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
      showNotification(extraClass, title, message)
      setTimeout(() => {
        window.location.replace("/")
      }
      , 5000)
    },
    onError(error){
      const extraClass = "notification-error"
      const title = "Expired Token"
      const message = "Please resend the reset password email."
      showNotification(extraClass, title, message)
    }
  });

  const showLoader = () => {
    document.getElementsByTagName('button')[0].lastChild.textContent = ''
    document.getElementById('loader').style.display = 'flex'
    if (!token) {
      sendResetPasswordEmail({ variables: { email: state.email }})
    } else {
      passwordReset({ variables: { token: state.token, newPassword1: state.password, newPassword2: state.password2 }})
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
          <Button
            className='btn login-btn centered w-100'
            label='Send Link'
            function={showLoader}
            variables={['email']}
            param= {{ variables: { email: state.email }}}
            iconClassName=""
            icon=''
            disabled={!state.email ? true : false}
          >
          <Loader />
          </Button>
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
          <Button
            className='btn login-btn centered w-100'
            label='Reset Password'
            function={showLoader}
            variables={['token', 'newPassword1', 'newPassword2']}
            param= {{ variables: { token: state.token, newPassword1: state.password, newPassword2: state.password2 }}}
            iconClassName=""
            icon=''
            disabled={!state.password || !state.password2 ? true : false}
          >
          <Loader />
          </Button>
        </>
        }
      </form>
    </div>
  )
}
