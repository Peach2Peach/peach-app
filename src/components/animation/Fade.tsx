import React, { ReactElement, useRef } from 'react'
import { Animated, ViewProps } from 'react-native'

type FadeProps = ViewProps & ComponentProps & {
  show?: boolean,
  duration?: number,
  delay?: number,
}

/**
 * @description Animated view to fade content in and out
 * @param children child element
 * @param show if true fade in, if false fade out
 * @param [style] css style object
 * @param [duration] animation duration in ms
 * @param [delay] animation delay in ms
 * @return view
 * @example <Fade show={true} duration={400} delay={500}>
    <Text>🍑</Text>
  </Fade>
 */
export const Fade = ({ children, style, show, duration = 400, delay = 0, pointerEvents }: FadeProps): ReactElement => {
  const fadeAnim = useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    Animated.timing(
      fadeAnim, {
        toValue: show ? 1 : 0,
        duration,
        delay,
        useNativeDriver: true
      }
    ).start()
  }, [show, delay, duration, fadeAnim])

  return <Animated.View pointerEvents={pointerEvents} style={{
    ...style,
    opacity: fadeAnim,
    display: fadeAnim ? 'flex' : 'none',
  }}>
    {children}
  </Animated.View>
}

export default Fade