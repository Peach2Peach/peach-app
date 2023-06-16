import { forwardRef, LegacyRef } from 'react'
import { ScrollView, ScrollViewProps } from 'react-native'

export const PeachScrollView = forwardRef(
  (
    {
      showsHorizontalScrollIndicator = false,
      showsVerticalScrollIndicator = false,
      ...scrollViewProps
    }: ScrollViewProps,
    ref: LegacyRef<ScrollView> | undefined,
  ) => (
    <ScrollView
      {...{ showsHorizontalScrollIndicator, showsVerticalScrollIndicator, ...scrollViewProps }}
      indicatorStyle="black"
      ref={ref}
      onStartShouldSetResponder={() => true}
    />
  ),
)
