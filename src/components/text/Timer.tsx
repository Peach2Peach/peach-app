import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Text } from '..'
import tw from '../../styles/tailwind'
import { msToTimer } from '../../utils/string'

type Props = ComponentProps & {
  text: string
  end: number
}

export const Timer = ({ text, end, style }: Props) => {
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
    <View style={[tw`flex-row justify-center w-full gap-1`, style]}>
      <Text style={tw`button-medium`}>{text}</Text>
      <Text style={[tw`button-medium`, timer > 0 ? tw`text-black-3` : tw`text-error-main`]}>{msToTimer(timer)}</Text>
    </View>
  )
}
