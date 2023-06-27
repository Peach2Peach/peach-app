import { forwardRef, LegacyRef } from 'react'
import { ScrollView, ScrollViewProps, View, ViewStyle } from 'react-native'

type Props = ScrollViewProps & {
  contentStyle?: ViewStyle | ViewStyle[]
}

export const PeachScrollView = forwardRef(
  (
    {
      showsHorizontalScrollIndicator = false,
      showsVerticalScrollIndicator = false,
      children,
      contentStyle,
      ...scrollViewProps
    }: Props,
    ref: LegacyRef<ScrollView> | undefined,
  ) => (
    <ScrollView {...{ showsHorizontalScrollIndicator, showsVerticalScrollIndicator, ref, ...scrollViewProps }}>
      <View onStartShouldSetResponder={() => true} style={contentStyle}>
        {children}
      </View>
    </ScrollView>
  ),
)
