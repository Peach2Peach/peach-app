import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { TouchableOpacity, View } from "react-native";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { PeachScrollView } from "../PeachScrollView";
import { PeachText } from "../text/PeachText";

export const TabBar = ({ state, navigation }: MaterialTopTabBarProps) => {
  const items = state.routes;
  const selected = items[state.index].name;
  const select = navigation.navigate;
  const colors = {
    text: tw`text-black-65`,
    textSelected: tw`text-black-100`,
    underline: tw`bg-black-100`,
  };

  return (
    <View>
      <PeachScrollView
        style={tw`w-full`}
        contentContainerStyle={tw`justify-center grow`}
        contentStyle={tw`flex-row justify-center gap-4`}
        horizontal
      >
        {items.map((item) => (
          <TouchableOpacity
            style={tw`shrink`}
            key={item.key + item.name}
            onPress={() => select(item)}
          >
            <PeachText
              style={[
                tw`px-4 py-2 text-center input-label`,
                item.name === selected ? colors.textSelected : colors.text,
              ]}
            >
              {i18n(item.name)}
            </PeachText>
            {item.name === selected && (
              <View style={[tw`w-full h-0.5`, colors.underline]} />
            )}
          </TouchableOpacity>
        ))}
      </PeachScrollView>
    </View>
  );
};
