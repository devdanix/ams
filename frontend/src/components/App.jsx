import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


// Components
import Login from './user/Login.jsx';
import Notification from './Notification.jsx';
import Calendar from './Calendar.jsx'
import Navbar from './Navbar.jsx';
import Activation from './user/Activation.jsx';
import Register from './user/Register.jsx';
import ResetPassword from './user/ResetPassword.jsx';
import Dashboard from './Dashboard.jsx';
import Companies from './Companies.jsx';

function App() {

  const [ userToken, setUserToken ] = useState('')
  const [ userID, setUserID ] = useState('')
  const [ isLogin, setIsLogin ] = useState(true)
  let locationCheck = window.location.pathname.includes('activate') || window.location.pathname.includes('password-reset')

  const inputRef = useRef('')

  // useEffect(() => {
  //   inputRef.current.focus();
  // }, []);

  // Notification Functions
  const showNotification = (extraClass, title, message) => {
    const elem = document.querySelector('#notification');
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

  const unmountWindow = () => {
    const elem = document.querySelector('#notification');
    ReactDOM.unmountComponentAtNode(elem)
  }

  const getRoutes = () => {
    if(!userToken && !locationCheck && isLogin ) {
      return <Login showNotification={showNotification} setUserToken={setUserToken} inputRef={inputRef} setIsLogin={setIsLogin} setUserID={setUserID}/>
    } else if (!userToken && !locationCheck && !isLogin) {
       return (
        <Routes>
          <Route path="/register" element={<Register showNotification={showNotification} setUserToken={setUserToken} setIsLogin={setIsLogin}/>} />
        </Routes>
       )
    } else if (locationCheck) {
      return (
        <>
          <Routes>
            <Route path="/activate/:token" element={<Activation showNotification={showNotification} setIsLogin={setIsLogin}/>} />
          </Routes>
          <Routes>
            <Route path="/password-reset/:token" element={<ResetPassword showNotification={showNotification} />} />
            <Route path="/password-reset/" element={<ResetPassword showNotification={showNotification} />} />
          </Routes>
        </>
      )
    } else {
      return(
      <>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Dashboard setUserToken={setUserToken} userID={userID}/>} />
        </Routes>
        <Routes>
          <Route path="/calendar" element={<Calendar setUserToken={setUserToken} showNotification={showNotification} userID={userID}/>} />
        </Routes>
        <Routes>
          <Route path="/companies" element={<Companies setUserToken={setUserToken} showNotification={showNotification} userID={userID}/>} />
        </Routes>
        <Routes>
          <Route path="/profile" element={<Calendar setUserToken={setUserToken} userID={userID}/>} />
        </Routes>
      </>
      )
    }
  }

  return (
    <>
      <div id="notification" />
      {/* <BrowserRouter>
        {getRoutes()}
      </BrowserRouter> */}

      <Calendar showNotification={showNotification} setUserToken={setUserToken} userID={userID}/>
    </>
  )
}

export default App;


