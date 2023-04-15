import { ReactElement, useEffect, useRef } from 'react'
import { LayoutChangeEvent, ScrollView, ScrollViewProps, View } from 'react-native'
import tw from '../styles/tailwind'

type PeachScrollViewProps = ComponentProps &
  ScrollViewProps & {
    scrollRef?: (ref: ScrollView) => void
    disable?: boolean
    onContainerLayout?: (e: LayoutChangeEvent) => void
    onContentLayout?: (e: LayoutChangeEvent) => void
  }

export const PeachScrollView = ({
  children,
  scrollRef,
  disable,
  onContainerLayout,
  onContentLayout,
  style,
  showsHorizontalScrollIndicator = false,
  showsVerticalScrollIndicator = false,
  persistentScrollbar,
  ...scrollViewProps
}: PeachScrollViewProps): ReactElement => {
  const onStartShouldSetResponder = () => !disable
  const $scroll = useRef<ScrollView>(null)

  useEffect(() => {
    if (scrollRef && $scroll.current) scrollRef($scroll.current)
  }, [$scroll, scrollRef])

  return !disable ? (
    <ScrollView
      ref={$scroll}
      {...{
        style,
        showsHorizontalScrollIndicator,
        showsVerticalScrollIndicator,
        persistentScrollbar,
        indicatorStyle: 'black',
        ...scrollViewProps,
      }}
      onLayout={onContainerLayout}
    >
      <View {...{ onStartShouldSetResponder }} style={tw`bg-transparent`} onLayout={onContentLayout}>
        {children}
      </View>
    </ScrollView>
  ) : (
    <View style={style}>{children}</View>
  )
}

export default PeachScrollView
