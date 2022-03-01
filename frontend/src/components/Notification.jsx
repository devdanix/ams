import React from 'react'


export default function Notification({
  extraClass = '',
  title = '',
  message = ''
}) {

  const unmountWindow = () => {
    const elem = document.querySelector('#notification-wrapper');
    ReactDOM.unmountComponentAtNode(elem)
  }

  const close = () => {
    document.getElementById('notification-wrapper').classList.remove('visible')
    document.getElementById('notification-wrapper').classList.add('invisible')
    unmountWindow()
  }


  return (
    <div id="notification-wrapper" className={`notification-wrapper visible ${extraClass}`}>
      <button onClick={close} className="notification-close-btn">X</button>
      <p className="notification-title">{title}</p>
      <p className="notification-message">{message}</p>
    </div>
  )
}
