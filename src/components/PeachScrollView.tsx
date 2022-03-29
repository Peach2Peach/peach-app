
import React, { LegacyRef, ReactElement, ReactNode } from 'react'
import { ScrollView, View, ViewStyle } from 'react-native'

interface ScrollViewProps {
  children?: ReactNode,
  ref?: LegacyRef<ScrollView>,
  contentContainerStyle?: ViewStyle|ViewStyle[],
  style?: ViewStyle|ViewStyle[],

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
export const PeachScrollView = ({ children, ref, contentContainerStyle, style }: ScrollViewProps): ReactElement =>
  <ScrollView ref={ref}
    contentContainerStyle={contentContainerStyle || {}}
    style={style || {}}>
    <View onStartShouldSetResponder={() => true}>
      {children}
    </View>
  </ScrollView>

export default PeachScrollView