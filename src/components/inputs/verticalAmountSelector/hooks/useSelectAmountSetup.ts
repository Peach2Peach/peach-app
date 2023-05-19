import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent } from 'react-native'
import { round } from '../../../../utils/math'
import { createPanResponder } from '../helpers/createPanResponder'
import { getOffset } from '../helpers/getOffset'
import { panListener } from '../helpers/panListener'
import { useKnobHeight } from '../hooks/useKnobHeight'

type Props = {
  min: number
  max: number
  value: number
  onChange: (value: number) => void
}

export const useSelectAmountSetup = ({ min, max, value, onChange }: Props) => {
  const knobHeight = useKnobHeight()
  const [trackHeight, setTrackHeight] = useState(260)
  const knobTrackHeight = trackHeight - knobHeight

  const [amount, setAmount] = useState(value)
  const trackRange: [number, number] = useMemo(() => [0, knobTrackHeight], [knobTrackHeight])

  const pan = useRef(new Animated.Value(getOffset({ amount, min, max, trackHeight: knobTrackHeight }))).current
  const panResponder = useRef(createPanResponder(pan)).current

  const setKnobOffset = useCallback(
    (newAmount: number) => {
      pan.setOffset(getOffset({ amount: newAmount, min, max, trackHeight: knobTrackHeight }))
    },
    [knobTrackHeight, max, min, pan],
  )
  const onTrackLayout = (event: LayoutChangeEvent) => {
    const height = Math.round(event.nativeEvent.layout.height)

    if (!height) return

    setTrackHeight(height)
    pan.setOffset(getOffset({ amount: value, min, max, trackHeight: height - knobHeight }))
  }
  const updateAmount = useCallback((val: number) => {
    setAmount(round(val, -4))
  }, [])

  const updateCustomAmount = (customAmount: number) => {
    const newAmount = Math.max(0, Math.min(max, customAmount))
    setAmount(newAmount)
    setKnobOffset(newAmount)
  }
  useEffect(() => panListener(pan, [max, min], trackRange, updateAmount), [max, min, pan, trackRange, updateAmount])

  useEffect(() => {
    onChange(amount)
  }, [onChange, amount, setKnobOffset])

  useEffect(() => {
    pan.extractOffset()
  }, [pan])

  return { amount, updateCustomAmount, pan, panResponder, trackRange, onTrackLayout }
}
