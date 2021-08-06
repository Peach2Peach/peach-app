import { useState, useEffect, EffectCallback } from 'react'
import { Dimensions, ScaledSize } from 'react-native'

export default (): ScaledSize => {
  const [windowSize, setWindowSize] = useState({
    width: NaN,
    height: NaN,
    scale: NaN,
    fontScale: NaN
  })

  const getWindowDimensions: EffectCallback = () => {
    const handleResize: EventListenerOrEventListenerObject = (): void => {
      setWindowSize(Dimensions.get('window'))
    }

    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('resize', handleResize)
    }

    setWindowSize(Dimensions.get('window'))
  }

  useEffect(getWindowDimensions, [])

  return windowSize
}