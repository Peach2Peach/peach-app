import { Animated, GestureResponderEvent, Insets } from 'react-native'
import { Icon } from '../../../components'
import tw from '../../../styles/tailwind'
import { horizontalSliderPadding, iconWidth, sectionContainerGap } from '../SellOfferPreferences'

type Props = {
  trackWidth: number
  setIsSliding: (isSliding: boolean) => void
  onDrag: (event: GestureResponderEvent) => void
  transform?: [{ translateX: number }]
  hitSlop?: Animated.WithAnimatedObject<Insets> | undefined
  type: 'buy' | 'sell'
}

export function Slider ({ trackWidth, setIsSliding, onDrag, transform, hitSlop, type }: Props) {
  const backgroundColor = type === 'sell' ? tw.color('primary-main') : tw.color('success-main')
  return (
    <Animated.View
      style={[
        tw`absolute items-center justify-center py-2px rounded-2xl`,
        { transform, paddingHorizontal: horizontalSliderPadding, backgroundColor },
      ]}
      hitSlop={hitSlop || { bottom: sectionContainerGap, left: trackWidth, right: trackWidth }}
      onStartShouldSetResponder={() => true}
      onResponderMove={onDrag}
      onTouchStart={(e) => {
        onDrag(e)
        setIsSliding(true)
      }}
      onTouchEnd={() => setIsSliding(false)}
    >
      <Icon id="chevronsUp" size={iconWidth} color={tw.color('primary-background-light')} />
    </Animated.View>
  )
}
