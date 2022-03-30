import ReactDOM from "react-dom";
import React from "react";

// Components
import Notification from "../../src/components/Notification.jsx";

export const useNotification = (extraClass, title, message) => {

  const elem = document.querySelector('#notification');

  const unmountWindow = () => {
    const elem = document.querySelector('#notification');
    ReactDOM.unmountComponentAtNode(elem)
  }

  ReactDOM.render(
    <Notification extraClass={extraClass} title={title} message={message}/>
    , elem);
  setTimeout(() => {
    document.getElementById('notification-wrapper').classList.remove('visible')
    document.getElementById('notification-wrapper').classList.add('invisible')
  }
  , 3000)
  setTimeout(() => unmountWindow(), 3500)

}