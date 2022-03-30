import React from 'react';

// Hooks
import { useNotification } from '../../../graphql/hooks/useNotification'
import { useCleanMutation } from '../../../graphql/hooks/useCleanMutation';

// Graphql
import { VERIFY_ACCOUNT } from '../../../graphql/users/mutation';


export default function Activation() {

  const token = window.location.pathname.split('/')[2]

  const verifyAccount = useCleanMutation(VERIFY_ACCOUNT, {
    onCompleted(data) {
      if(data.verifyAccount.success) {
        const extraClass = "notification-success"
        const title = "Activation Success"
        const message = "Your account has been activated."
        useNotification(extraClass, title, message)
        setTimeout(() => {
          window.location.replace("/")
        }
        , 3000)
      }
      else {
        const extraClass = "notification-error"
        const title = "Activation Failed"
        const message = data.verifyAccount.errors.nonFieldErrors[0].message
        useNotification(extraClass, title, message)
      }
    },
  });

  return (
    <div className='w-100 mt-p10'>
      <p className='activation-text'>Thank you for creating an account. Please verify your email address to set up your account.</p>
      <div className='w-10 centered'>
        <button
          className='btn login-btn centered w-100'
          onClick={(e) => {
            e.preventDefault()
            verifyAccount({ token: token })}
          }
        >Activate</button>
      </div>
      <p className='activation-text '>Already verified? Please <a href="/">Login</a></p>
    </div>
  )
}
