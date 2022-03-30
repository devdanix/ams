import React, { useRef, useContext } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


// Components
import Login from './user/Login.jsx';
import Calendar from './Calendar.jsx'
import Navbar from './Navbar.jsx';
import Activation from './user/Activation.jsx';
import Register from './user/Register.jsx';
import ResetPassword from './user/ResetPassword.jsx';
import Dashboard from './Dashboard.jsx';
import Companies from './Companies.jsx';
import Profile from './Profile.jsx';
import Users from './Users.jsx';

// Context
import { GlobalContext } from './context/GlobalProvider.js';


function App() {

  const { userToken, userIDContext, isLogin } = useContext(GlobalContext)
  const [ userTokenValue, setUserToken ] = userToken
  const [ userIDValue, setUserIDValue ] = userIDContext
  const [ isLoginValue, setIsLogin ] = isLogin


  console.log(userTokenValue, userIDValue, isLoginValue)
  // const [ userToken, setUserToken ] = useState('')
  // const [ userID, setUserID ] = useState('')
  // const [ isLogin, setIsLogin ] = useState(true)
  let locationCheck = window.location.pathname.includes('activate') || window.location.pathname.includes('password-reset')

  const inputRef = useRef('')

  const getRoutes = () => {
    if(!userTokenValue && !locationCheck && isLoginValue ) {
      return <Login inputRef={inputRef} />
    } else if (!userTokenValue && !locationCheck && !isLoginValue ) {
       return (
        <Routes>
          <Route path="/register" element={<Register />} />
        </Routes>
       )
    } else if (locationCheck) {
      return (
        <>
          <Routes>
            <Route path="/activate/:token" element={<Activation />} />
            <Route path="/password-reset/:token" element={<ResetPassword />} />
            <Route path="/password-reset/" element={<ResetPassword />} />
          </Routes>
        </>
      )
    } else {
      return(
      <>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </>
      )
    }
  }

  return (
    <>
      <div id="notification" />
      <BrowserRouter>
        {getRoutes()}
      </BrowserRouter>
    </>
  )
}

export default App;


