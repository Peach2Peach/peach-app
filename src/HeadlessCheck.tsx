import React from 'react'
import App from './App'

const AppFake = () => null

type HeadlessCheckProps = {
  isHeadless: boolean
}

export const HeadlessCheck = ({ isHeadless }: HeadlessCheckProps): ComponentType<any> => {
  if (isHeadless) {
    // App has been launched in the background by iOS, ignore
    return <AppFake />
  }

  return <App />
}