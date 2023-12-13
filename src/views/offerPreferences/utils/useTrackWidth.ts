import { useMemo } from 'react'
import { useWindowDimensions } from 'react-native'
import { useIsMediumScreen } from '../../../hooks'
import { sectionContainerPadding } from '../components/Section'
import { horizontalTrackPadding } from '../components/SliderTrack'

export const useTrackWidth = () => {
  const { width } = useWindowDimensions()
  const isMediumScreen = useIsMediumScreen()
  const screenPadding = useMemo(() => (isMediumScreen ? 16 : 8), [isMediumScreen])
  const trackWidth = useMemo(
    () => width - screenPadding - sectionContainerPadding - horizontalTrackPadding,
    [screenPadding, width],
  )
  return trackWidth
}
