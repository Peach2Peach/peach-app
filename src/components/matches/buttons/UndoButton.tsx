import { useEffect, useMemo, useRef } from 'react';
import { Animated, View } from 'react-native'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { Button } from '../../buttons'

type Props = {
  onPress: () => void
  onTimerFinished: () => void
}

const startTimer = (timer: Animated.Value, onTimerFinished: () => void) => {
  Animated.timing(timer, {
    toValue: 0,
    duration: 5000,
    useNativeDriver: false,
  }).start(({ finished }) => {
    if (!finished) return
    onTimerFinished()
  })
}
const narrow = Number(tw`w-39`.width)

export const UndoButton = ({ onPress, onTimerFinished }: Props) => {
  const timer = useRef(new Animated.Value(1)).current

  useEffect(() => {
    startTimer(timer, onTimerFinished)
  }, [onTimerFinished, timer])

  const width = useMemo(
    () =>
      timer.interpolate({
        inputRange: [0, 1],
        outputRange: [0, narrow],
      }),
    [timer],
  )
  const sharedProps = useMemo(
    () =>
      ({
        onPress,
        iconId: 'rotateCounterClockwise',
        narrow: true,
        textColor: tw`text-black-1`,
      } as const),
    [onPress],
  )

  return (
    <View style={tw`items-center justify-center min-w-39`}>
      <Animated.View style={[tw`self-start overflow-hidden`, { width }]}>
        <Button {...sharedProps} style={tw`bg-primary-background-light`}>
          {i18n('search.undo')}
        </Button>
      </Animated.View>

      <Button {...sharedProps} style={[tw`absolute`, { backgroundColor: '#FFFCFA80' }]}>
        {i18n('search.undo')}
      </Button>
    </View>
  )
}
