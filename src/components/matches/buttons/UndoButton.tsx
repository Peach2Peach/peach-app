import React from 'react'
import { Animated, View } from 'react-native'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { Button } from '../../buttons'

type Props = {
  onPress: () => void
  timer: Animated.Value
  inputRange: [number, number]
}

export const UndoButton = ({ onPress, timer, inputRange }: Props) => {
  const narrow = Number(tw`w-39`.width)
  const width = timer.interpolate({
    inputRange,
    outputRange: [0, narrow],
  })
  const sharedProps = {
    onPress,
    iconId: 'rotateCounterClockwise',
    narrow: true,
    textColor: tw`text-black-1`,
  } as const

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
