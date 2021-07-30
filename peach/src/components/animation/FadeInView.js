import React, { useRef } from 'react'
import { Animated } from 'react-native'

/**
 * @description Animated view to fade in content
 * @param {object} style css style object
 * @param {object[]} children child element
 * @param {number} duration animation duration in ms
 * @param {number} delay animation delay in ms
 * @return {function} view
 * @example <FadeInView duration={400} delay={500}>
    <Text>🍑</Text>
  </FadeInView>
 */
export default ({ style, children, duration = 400, delay = 0 }) => {
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
  }, [fadeAnim])

  return <Animated.View style = {{
    ...style,
    opacity: fadeAnim,
  }}>
    {children}
  </Animated.View>
}