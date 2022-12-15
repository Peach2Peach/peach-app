import React, { ReactElement, useEffect, useRef } from 'react'
import { LayoutChangeEvent, ScrollView, ScrollViewProps, View } from 'react-native'
import tw from '../styles/tailwind'

type PeachScrollViewProps = ComponentProps &
  ScrollViewProps & {
    scrollRef?: (ref: ScrollView) => void
    disable?: boolean
    onContainerLayout?: (e: LayoutChangeEvent) => void
    onContentLayout?: (e: LayoutChangeEvent) => void
  }

/**
 * @description Component to add scroll functionality withing AvoidKeyboard
 * @param props Component properties
 * @param props.children child elements
 * @example
 * <ScrollView>
 *    <Text>Your content</Text>
 * </ScrollView>
 */
export const PeachScrollView = ({
  children,
  scrollRef,
  contentContainerStyle,
  horizontal = false,
  showsHorizontalScrollIndicator = true,
  disable,
  scrollEventThrottle,
  onScroll,
  onContainerLayout,
  onContentLayout,
  style,
}: PeachScrollViewProps): ReactElement => {
  const onStartShouldSetResponder = () => !disable
  const $scroll = useRef<ScrollView>(null)

  useEffect(() => {
    $scroll.current?.flashScrollIndicators()
  }, [])

  useEffect(() => {
    if (scrollRef && $scroll.current) scrollRef($scroll.current)
  }, [$scroll])

  return !disable ? (
    <ScrollView
      ref={$scroll}
      horizontal={horizontal}
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      removeClippedSubviews={false}
      contentContainerStyle={contentContainerStyle || {}}
      onLayout={onContainerLayout}
      style={style || {}}
    >
      <View onStartShouldSetResponder={onStartShouldSetResponder} style={tw`bg-transparent`} onLayout={onContentLayout}>
        {children}
      </View>
    </ScrollView>
  ) : (
    <View style={style}>{children}</View>
  )
}

export default PeachScrollView
