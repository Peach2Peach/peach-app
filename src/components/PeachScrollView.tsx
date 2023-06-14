import { useEffect, useRef } from 'react'
import { ScrollView, ScrollViewProps, View } from 'react-native'

type Props = ComponentProps &
  ScrollViewProps & {
    scrollRef?: (ref: ScrollView) => void
    disable?: boolean
  }

export const PeachScrollView = ({
  children,
  scrollRef,
  disable,
  style,
  showsHorizontalScrollIndicator = false,
  showsVerticalScrollIndicator = false,
  ...scrollViewProps
}: Props) => {
  const $scroll = useRef<ScrollView>(null)

  useEffect(() => {
    if (scrollRef && $scroll.current) scrollRef($scroll.current)
  }, [$scroll, scrollRef])

  return !disable ? (
    <ScrollView
      ref={$scroll}
      {...{ style, showsHorizontalScrollIndicator, showsVerticalScrollIndicator, ...scrollViewProps }}
      indicatorStyle="black"
      onStartShouldSetResponder={() => true}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={style}>{children}</View>
  )
}
