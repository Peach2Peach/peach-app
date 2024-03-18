import { ScrollView, TouchableOpacity, View } from "react-native";
import { useToggleBoolean } from "../../hooks/useToggleBoolean";
import tw from "../../styles/tailwind";
import { TouchableIcon } from "../TouchableIcon";
import { PeachText } from "../text/PeachText";

type Props<T> = {
  value: T;
  options: T[];
  onChange: (value: T) => void;
};
export const Dropdown = <T extends string>({
  value,
  options,
  onChange,
}: Props<T>) => {
  const [open, toggleOpen] = useToggleBoolean();
  return (
    <TouchableOpacity
      onPress={toggleOpen}
      style={[tw`flex-row`, { zIndex: 1 }]}
    >
      <ScrollView
        style={tw`self-start bg-primary-background-main max-h-40 border rounded-lg`}
        contentContainerStyle={tw`pl-2`}
        scrollEnabled={open}
        showsVerticalScrollIndicator={false}
      >
        <View style={tw`h-10 pr-8`}>
          <PeachText style={tw`subtitle-0 leading-10`}>{value}</PeachText>
        </View>
        {open &&
          options
            .filter((option) => option !== value)
            .map((option) => (
              <PeachText
                style={tw`flex-row items-center gap-1 h-10 subtitle-0 leading-10`}
                onPress={() => {
                  onChange(option);
                  toggleOpen();
                }}
                key={option}
              >
                {option}
              </PeachText>
            ))}
      </ScrollView>
      <TouchableIcon
        id={open ? "chevronUp" : "chevronDown"}
        style={tw`absolute top-2 right-2`}
        onPress={toggleOpen}
        iconColor={tw.color("black-100")}
      />
    </TouchableOpacity>
  );
};
