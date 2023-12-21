import { useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'
import { msToTimer } from '../../utils/string/msToTimer'
import { PeachText } from './PeachText'

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

  return <PeachText style={style}>{msToTimer(timer)}</PeachText>
}

export const Timer = ({ text, end, style }: Props) => (
  <View style={[tw`flex-row justify-center w-full gap-1`, style]}>
    {!!text && <PeachText style={tw`button-medium`}>{text}</PeachText>}
    <SimpleTimer style={[tw`button-medium`, Date.now() <= end ? tw`text-black-3` : tw`text-error-main`]} end={end} />
  </View>
)
