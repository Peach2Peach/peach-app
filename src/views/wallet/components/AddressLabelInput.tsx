import { useRef, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { shallow } from "zustand/shallow";
import { Icon } from "../../../components/Icon";
import { useThemeStore } from "../../../store/theme"; // Import theme store for dark mode check
import tw from "../../../styles/tailwind";
import { useWalletState } from "../../../utils/wallet/walletStore";

type Props = {
  address: string;
  fallback?: string;
};

export function AddressLabelInput({ address, fallback }: Props) {
  const { isDarkMode } = useThemeStore(); // Access dark mode state
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useWalletState(
    (state) => [state.addressLabelMap[address] ?? fallback, state.labelAddress],
    shallow,
  );

  const $input = useRef<TextInput>(null);

  const onChangeText = (text: string) => {
    setLabel(address, text);
  };

  const onIconPress = () => {
    if (isEditing) {
      setIsEditing(false);
      $input.current?.blur();
    } else {
      setIsEditing(true);
      $input.current?.focus();
    }
  };

  return (
    <View style={tw`flex-row items-center justify-center gap-1`}>
      <TextInput
        value={label}
        onChangeText={onChangeText}
        ref={$input}
        style={[
          tw`overflow-hidden leading-relaxed text-center body-l`,
          {
            color: isDarkMode ? tw.color("backgroundLight-light") : tw.color("black-100"), // Adapt text color based on theme
          },
        ]}
      />
      <TouchableOpacity onPress={onIconPress}>
        <Icon
          id={isEditing ? "checkSquare" : "edit3"}
          color={tw.color("primary-main")}
          size={20}
        />
      </TouchableOpacity>
    </View>
  );
}
