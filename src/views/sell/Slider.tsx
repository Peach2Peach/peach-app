import { Animated, GestureResponderEvent } from 'react-native'
import { Icon } from '../../components'
import tw from '../../styles/tailwind'
import { horizontalSliderPadding, iconWidth, sectionContainerGap } from './SellOfferPreferences'

type Props = {
  trackWidth: number
  setIsSliding: (isSliding: boolean) => void
  onDrag: (event: GestureResponderEvent) => void
  transform?: [{ translateX: number }]
}

export function Slider ({ trackWidth, setIsSliding, onDrag, transform }: Props) {
  return (
    <Animated.View
      style={[
        tw`absolute items-center justify-center py-2px rounded-2xl bg-primary-main`,
        { transform, paddingHorizontal: horizontalSliderPadding },
      ]}
      hitSlop={{ bottom: sectionContainerGap, left: trackWidth, right: trackWidth }}
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
