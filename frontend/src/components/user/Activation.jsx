import React from 'react';
import { useMutation } from '@apollo/client'


// Graphql
import { VERIFY_ACCOUNT } from '../../../graphql/users/mutation';


// Components
import Button from '../Button.jsx'

export default function Activation({
  showNotification = f => f,
  setIsLogin = f => f,
}) {

  const token = window.location.pathname.split('/')[2]

  const [ verifyAccount ] = useMutation(VERIFY_ACCOUNT, {
    onCompleted(data) {

      if(data.verifyAccount.success) {
        const extraClass = "notification-success"
        const title = "Activation Success"
        const message = "Your account has been activated."
        showNotification(extraClass, title, message)
        setTimeout(() => {
          window.location.replace("/")
        }
        , 3000)
      }
      else {
        const extraClass = "notification-error"
        const title = "Activation Failed"
        const message = data.verifyAccount.errors.nonFieldErrors[0].message
        showNotification(extraClass, title, message)
      }
    },
  });

  return (
    <div className='w-100 mt-p10'>
      <p className='activation-text'>Thank you for creating an account. Please verify your email address to set up your account.</p>
      <div className='w-10 centered'>
        <Button
          className='btn login-btn centered w-100'
          label='Activate'
          function={verifyAccount}
          variables={['token']}
          param= {{ variables: { token: token }}}
          iconClassName=""
          icon=''
        />
      </div>
      <p className='activation-text '>Already verified? Please <a href="/">Login</a></p>
    </div>
  )
}
