import React, { ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'

import { Text } from '..'
import tw from '../../styles/tailwind'
import { msToTimer } from '../../utils/string'

type TimerProps = ComponentProps & {
  text: string,
  start: number
  duration: number
}

/**
 * @TODO add case for 0 time left
 * @param text text to display
 * @param start start date as unix timestamp
 * @param duration max time in ms
 */
export const Timer = ({ text, start, duration, style }: TimerProps): ReactElement => {
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = (new Date()).getTime()
      const timeLeft = duration - (now - start)

      setTimer(timeLeft > 0 ? timeLeft : 0)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [start, duration])

  return <View style={[tw`flex-row justify-center`, style]}>
    <Text style={tw`text-sm font-baloo`}>{text}</Text>
    <Text style={tw`w-16 pl-1 text-sm font-baloo text-peach-1`}>{msToTimer(timer)}</Text>
  </View>
}

export default Timer