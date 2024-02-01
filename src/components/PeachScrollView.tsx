import { forwardRef } from "react";
import { ScrollView, ScrollViewProps, View, ViewStyle } from "react-native";

type Props = ScrollViewProps & {
  contentStyle?: ViewStyle | ViewStyle[];
};

export const PeachScrollView = forwardRef<ScrollView, Props>(
  (
    {
      showsHorizontalScrollIndicator = false,
      showsVerticalScrollIndicator = false,
      children,
      contentStyle,
      ...scrollViewProps
    },
    ref,
  ) => (
    <ScrollView
      {...{
        showsHorizontalScrollIndicator,
        showsVerticalScrollIndicator,
        ref,
        ...scrollViewProps,
      }}
    >
      <View onStartShouldSetResponder={() => true} style={contentStyle}>
        {children}
      </View>
    </ScrollView>
  ),
);
