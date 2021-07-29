import { useState, useEffect } from 'react'
import { Dimensions } from 'react-native'

export default () => {
  const [windowSize, setWindowSize] = useState({
    width: null,
    height: null,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(Dimensions.get('window'))
    }

    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('resize', handleResize)
    }

    handleResize()

    return () => typeof window !== 'undefined' && window.addEventListener
      ? window.removeEventListener('resize', handleResize)
      : null
  }, [])

  return windowSize
}