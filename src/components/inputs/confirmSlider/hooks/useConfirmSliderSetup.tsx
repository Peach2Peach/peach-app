import { useMemo, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent, PanResponder } from 'react-native'
import { useIsMediumScreen } from '../../../../hooks'
import { getNormalized } from '../../../../utils/math/getNormalized'

type Props = ComponentProps & {
  onConfirm: () => void
  enabled: boolean
}

const defaultWidth = 260

export const useConfirmSliderSetup = ({ enabled, onConfirm }: Props) => {
  const isMediumScreen = useIsMediumScreen()
  const knobWidth = isMediumScreen ? 56 : 46
  const [widthToSlide, setWidthToSlide] = useState(defaultWidth - knobWidth)

  const onLayout = (event: LayoutChangeEvent) => {
    if (!event.nativeEvent.layout.width) return
    const width = Math.round(event.nativeEvent.layout.width)
    setWidthToSlide(width - knobWidth)
  }

  const pan = useRef(new Animated.Value(0)).current
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => enabled,
        onPanResponderMove: (e, gestureState) => {
          if (!enabled) return
          const x = gestureState.dx
          pan.setValue(getNormalized(x, widthToSlide))
        },
        onPanResponderRelease: (_e, { dx }) => {
          const normalizedVal = getNormalized(dx, widthToSlide)
          if (normalizedVal >= 1 && enabled) onConfirm()
          Animated.timing(pan, {
            toValue: 0,
            duration: 100,
            delay: 10,
            useNativeDriver: false,
          }).start()
        },
        onShouldBlockNativeResponder: () => true,
      }),
    [enabled, onConfirm, pan, widthToSlide],
  )

  return { panResponder, pan, widthToSlide, onLayout }
}
