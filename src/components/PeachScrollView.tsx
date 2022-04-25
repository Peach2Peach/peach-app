
import React, { ReactElement, Ref } from 'react'
import { ScrollView, ScrollViewProps, View } from 'react-native'
import tw from '../styles/tailwind'

type PeachScrollViewProps = ComponentProps & ScrollViewProps & {
  scrollRef?: Ref<ScrollView>,
  disable?: boolean,
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
  style
}: PeachScrollViewProps): ReactElement => {
  const onStartShouldSetResponder = () => !disable

  return <ScrollView ref={scrollRef}
    horizontal={horizontal}
    onScroll={onScroll}
    scrollEventThrottle={scrollEventThrottle}
    showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
    contentContainerStyle={contentContainerStyle || {}}
    style={style || {}}>
    <View onStartShouldSetResponder={onStartShouldSetResponder} style={tw`bg-transparent`}>
      {children}
    </View>
  </ScrollView>
}

export default PeachScrollView