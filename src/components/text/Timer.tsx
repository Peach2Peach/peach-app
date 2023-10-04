import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Text } from '..'
import tw from '../../styles/tailwind'
import { msToTimer } from '../../utils/string'

type Props = ComponentProps & {
  text?: string
  end: number
}

export const SimpleTimer = ({ end, style }: Props) => {
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

  return <Text style={style}>{msToTimer(timer)}</Text>
}

export const Timer = ({ text, end, style }: Props) => (
  <View style={[tw`flex-row justify-center w-full gap-1`, style]}>
    {!!text && <Text style={tw`button-medium`}>{text}</Text>}
    <SimpleTimer style={[tw`button-medium`, Date.now() > end ? tw`text-black-3` : tw`text-error-main`]} end={end} />
  </View>
)
