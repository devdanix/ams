import React, { useState, createContext } from 'react'

export const GlobalContext = createContext()

export default function GlobalProvider({ children }) {

  const [ userToken, setUserToken ] = useState('')
  const [ userIDValue, setUserIDValue ] = useState(1)
  const [ isLogin, setIsLogin ] = useState(true)

  const value = {
    userToken: [ userToken, setUserToken ],
    userIDContext: [ userIDValue, setUserIDValue ],
    isLogin: [ isLogin, setIsLogin ]
  }

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  )
}
