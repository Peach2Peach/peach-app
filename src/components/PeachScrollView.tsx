
import React, { ReactElement, Ref } from 'react'
import { ScrollView, ScrollViewProps, View } from 'react-native'

type PeachScrollViewProps = ComponentProps & ScrollViewProps & {
  scrollRef?: Ref<ScrollView>,
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
  scrollEventThrottle,
  onScroll,
  style
}: PeachScrollViewProps): ReactElement =>
  <ScrollView ref={scrollRef}
    horizontal={horizontal}
    onScroll={onScroll}
    scrollEventThrottle={scrollEventThrottle}
    showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
    contentContainerStyle={contentContainerStyle || {}}
    style={style || {}}>
    <View onStartShouldSetResponder={() => true}>
      {children}
    </View>
  </ScrollView>

export default PeachScrollView