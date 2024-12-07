import { ScrollView, TouchableOpacity, View } from "react-native";
import { shallow } from "zustand/shallow";
import { TouchableIcon } from "../../../components/TouchableIcon";
import { PeachText } from "../../../components/text/PeachText";
import { useToggleBoolean } from "../../../hooks/useToggleBoolean";
import { CURRENCIES } from "../../../paymentMethods";
import { useSettingsStore } from "../../../store/settingsStore/useSettingsStore";
import tw from "../../../styles/tailwind";
import { textStyle } from "./SatsInputComponent";

export function DisplayCurrencySelector() {
  const [showCurrencies, toggle] = useToggleBoolean();
  const [displayCurrency, setDisplayCurrency] = useSettingsStore(
    (state) => [state.displayCurrency, state.setDisplayCurrency],
    shallow,
  );
  return (
    <TouchableOpacity onPress={toggle} style={tw`items-end min-w-20`}>
      <ScrollView
        style={tw`absolute z-20 max-h-29`}
        contentContainerStyle={tw`border rounded-lg px-6px bg-primary-background-light border-black-25`}
        scrollEnabled={showCurrencies}
        showsVerticalScrollIndicator={false}
        onStartShouldSetResponder={() => showCurrencies}
      >
        <View style={tw`flex-row items-center gap-1`}>
          <PeachText style={[tw.style(textStyle), tw`text-left`]}>
            {displayCurrency}
          </PeachText>
          <TouchableIcon
            id={showCurrencies ? "chevronUp" : "chevronDown"}
            onPress={toggle}
            iconColor={tw.color("black-100")}
          />
        </View>
        {showCurrencies &&
          CURRENCIES.filter((c) => c !== displayCurrency).map((c) => (
            <PeachText
              style={[tw.style(textStyle), tw`text-left`]}
              onPress={() => {
                setDisplayCurrency(c);
                toggle();
              }}
              key={c}
            >
              {c}
            </PeachText>
          ))}
      </ScrollView>
    </TouchableOpacity>
  );
}
