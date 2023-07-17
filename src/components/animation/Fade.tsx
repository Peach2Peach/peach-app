import { useEffect, useRef, useState } from 'react'
import { Animated, ViewProps } from 'react-native'

type FadeProps = ViewProps &
  ComponentProps & {
    show?: boolean
    duration?: number
    delay?: number
    displayNone?: boolean
  }

export const Fade = ({
  children,
  style,
  show,
  duration = 400,
  delay = 0,
  pointerEvents,
  displayNone = true,
}: FadeProps) => {
  const fadeAnim = useRef(new Animated.Value(show ? 1 : 0)).current
  const [display, setDisplay] = useState(true)

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: show ? 1 : 0,
      duration,
      delay,
      useNativeDriver: true,
    }).start()
  }, [show, delay, duration, fadeAnim])

  useEffect(() => {
    fadeAnim.addListener((fade) => {
      setDisplay(!displayNone || fade.value > 0)
    })
  }, [])

  return (
    <Animated.View
      pointerEvents={pointerEvents}
      style={{
        ...(display ? style : {}),
        opacity: fadeAnim,
      }}
    >
      {display ? children : null}
    </Animated.View>
  )
}
