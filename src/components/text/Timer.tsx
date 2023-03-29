import { ReactElement, useEffect, useState } from 'react'
import { View } from 'react-native'

import { Text } from '..'
import tw from '../../styles/tailwind'
import { msToTimer } from '../../utils/string'

type TimerProps = ComponentProps & {
  text: string
  end: number
}

export const Timer = ({ text, end, style }: TimerProps): ReactElement => {
  const [timer, setTimer] = useState(end - Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      const timeLeft = end - Date.now()

      setTimer(timeLeft > 0 ? timeLeft : 0)
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [end])

  return (
    <View style={[tw`flex-row justify-center`, style]}>
      <Text style={tw`button-medium uppercase`}>{text}</Text>
      <Text style={[tw`w-18 pl-1 button-medium`, timer > 0 ? tw`text-black-3` : tw`text-error-main`]}>
        {msToTimer(timer)}
      </Text>
    </View>
  )
}

export default Timer
