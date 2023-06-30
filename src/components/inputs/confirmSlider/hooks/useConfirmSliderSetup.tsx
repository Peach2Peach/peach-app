import { useMemo, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent, PanResponder } from 'react-native'
import { getNormalized } from '../../../../utils/math'

type Props = ComponentProps & {
  knobWidth: number
  onConfirm: () => void
  disabled?: boolean
}

const defaultWidth = 260

export const useConfirmSliderSetup = ({ disabled, onConfirm, knobWidth }: Props) => {
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
        onMoveShouldSetPanResponder: () => !disabled,
        onPanResponderMove: (e, gestureState) => {
          if (disabled) return
          const x = gestureState.dx
          pan.setValue(getNormalized(x, widthToSlide))
        },
        onPanResponderRelease: (_e, { dx }) => {
          const normalizedVal = getNormalized(dx, widthToSlide)
          if (normalizedVal >= 1 && !disabled) onConfirm()
          Animated.timing(pan, {
            toValue: 0,
            duration: 100,
            delay: 10,
            useNativeDriver: false,
          }).start()
        },
        onShouldBlockNativeResponder: () => true,
      }),
    [disabled, onConfirm, pan, widthToSlide],
  )

  return { panResponder, pan, widthToSlide, onLayout }
}
