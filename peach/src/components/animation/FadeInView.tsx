import React, { ReactElement, ReactNode, useRef } from 'react'
import { Animated, ViewStyle } from 'react-native'

type FadeInViewProps = {
  children: ReactNode,
  style?: ViewStyle,
  duration?: number,
  delay?: number
}

/**
 * @description Animated view to fade in content
 * @param children child element
 * @param [style] css style object
 * @param [duration] animation duration in ms
 * @param [delay] animation delay in ms
 * @return view
 * @example <FadeInView duration={400} delay={500}>
    <Text>🍑</Text>
  </FadeInView>
 */
export default ({ children, style, duration = 400, delay = 0 }: FadeInViewProps): ReactElement => {
  const fadeAnim = useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    Animated.timing(
      fadeAnim, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true
      }
    ).start()
  }, [delay, duration, fadeAnim])

  return <Animated.View style={{
    ...style,
    opacity: fadeAnim
  }}>
    {children}
  </Animated.View>
}