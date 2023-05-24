import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Keyboard, LayoutChangeEvent } from 'react-native'
import { interpolate, round } from '../../../../utils/math'
import { createPanResponder } from '../helpers/createPanResponder'
import { getOffset } from '../helpers/getOffset'
import { panListener } from '../helpers/panListener'
import { useKnobHeight } from '../hooks/useKnobHeight'

type Props = {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
}

// eslint-disable-next-line max-lines-per-function, max-statements
export const useRangeAmountSetup = ({ min, max, value, onChange }: Props) => {
  const knobHeight = useKnobHeight()
  const [trackHeight, setTrackHeight] = useState(260)
  const knobTrackHeight = trackHeight - knobHeight

  const [maximum, setMaximum] = useState(value[1])
  const [minimum, setMinimum] = useState(value[0])

  const maxY = useMemo(
    () => getOffset({ amount: maximum, min, max, trackHeight: knobTrackHeight }),
    [knobTrackHeight, max, maximum, min],
  )
  const minY = useMemo(
    () => getOffset({ amount: minimum, min, max, trackHeight: knobTrackHeight }),
    [knobTrackHeight, max, min, minimum],
  )

  const trackRange: [number, number] = useMemo(() => [0, knobTrackHeight], [knobTrackHeight])
  const trackRangeMax: [number, number] = useMemo(() => [0, knobTrackHeight - knobHeight], [knobHeight, knobTrackHeight])
  const trackRangeMin: [number, number] = useMemo(() => [knobHeight, knobTrackHeight], [knobHeight, knobTrackHeight])

  const minSatsDistance = useMemo(
    () => round(interpolate(knobHeight, [0, knobTrackHeight], [0, max - min]), -4),
    [knobHeight, knobTrackHeight, max, min],
  )
  const panMax = useRef(new Animated.Value(maxY)).current
  const panMin = useRef(new Animated.Value(minY)).current

  const panMaxResponder = useRef(createPanResponder(panMax)).current
  const panMinResponder = useRef(createPanResponder(panMin)).current

  const setKnobOffsetMaximum = useCallback(
    (newAmount: number) => panMax.setOffset(getOffset({ amount: newAmount, min, max, trackHeight: knobTrackHeight })),
    [knobTrackHeight, max, min, panMax],
  )
  const setKnobOffsetMinimum = useCallback(
    (newAmount: number) => panMin.setOffset(getOffset({ amount: newAmount, min, max, trackHeight: knobTrackHeight })),
    [knobTrackHeight, max, min, panMin],
  )

  const updateCustomAmountMaximum = (customAmount: number) => {
    const newMaximum = Math.max(0, Math.min(max, customAmount))
    if (customAmount > newMaximum) Keyboard.dismiss()

    setMaximum(newMaximum)
    setKnobOffsetMaximum(newMaximum)

    const newMinimum = Math.max(min, Math.min(newMaximum - minSatsDistance, minimum))
    if (minimum !== newMinimum) {
      setMinimum(newMinimum)
      setKnobOffsetMinimum(newMinimum)
    }
  }
  const updateCustomAmountMinimum = (customAmount: number) => {
    const newMinimum = Math.max(0, Math.min(max, customAmount))
    if (customAmount > newMinimum) Keyboard.dismiss()
    setMinimum(newMinimum)
    setKnobOffsetMinimum(newMinimum)

    const newMaximum = Math.min(max, Math.max(newMinimum + minSatsDistance, maximum))
    if (maximum !== newMaximum) {
      setMaximum(newMaximum)
      setKnobOffsetMaximum(newMaximum)
    }
  }

  const onTrackLayout = (event: LayoutChangeEvent) => {
    const height = Math.round(event.nativeEvent.layout.height)
    setTrackHeight(height)
    const newKnowTrackHeight = height - knobHeight
    panMax.setOffset(getOffset({ amount: maximum, min, max, trackHeight: newKnowTrackHeight }))
    panMin.setOffset(getOffset({ amount: minimum, min, max, trackHeight: newKnowTrackHeight }))
  }

  const setMaximumRounded = useCallback(
    (val: number, abs: number) => {
      const roundedVal = round(val, -4)

      if (roundedVal - minimum < minSatsDistance) {
        panMin.setOffset(abs + knobHeight)
        setMinimum(roundedVal - minSatsDistance)
      }
      setMaximum(roundedVal)
    },
    [knobHeight, minSatsDistance, minimum, panMin],
  )
  const setMinimumRounded = useCallback(
    (val: number, abs: number) => {
      const roundedVal = round(val, -4)

      if (maximum - roundedVal < minSatsDistance) {
        panMax.setOffset(abs - knobHeight)
        setMaximum(roundedVal + minSatsDistance)
      }
      setMinimum(roundedVal)
    },
    [knobHeight, minSatsDistance, maximum, panMax],
  )

  useEffect(
    () => panListener(panMax, [max, min], trackRange, setMaximumRounded, trackRangeMax),
    [max, min, panMax, setMaximumRounded, trackRange, trackRangeMax],
  )
  useEffect(
    () => panListener(panMin, [max, min], trackRange, setMinimumRounded, trackRangeMin),
    [max, min, panMin, setMinimumRounded, trackRange, trackRangeMin],
  )

  useEffect(() => {
    onChange([minimum, maximum])
  }, [onChange, minimum, maximum])

  useEffect(() => {
    panMin.extractOffset()
    panMax.extractOffset()
  }, [panMin, panMax])

  return {
    minimum,
    maximum,
    updateCustomAmountMaximum,
    updateCustomAmountMinimum,
    minY,
    maxY,
    panMin,
    panMax,
    panMinResponder,
    panMaxResponder,
    trackRangeMin,
    trackRangeMax,
    onTrackLayout,
    knobHeight,
  }
}
