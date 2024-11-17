import { TouchableOpacity } from "react-native";
import { Icon } from "../../../components/Icon";
import { TouchableIcon } from "../../../components/TouchableIcon";
import { MeansOfPayment } from "../../../components/offer/MeansOfPayment";
import { PeachText } from "../../../components/text/PeachText";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { useThemeStore } from "../../../store/theme"; // Import useThemeStore
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";
import { hasMopsConfigured } from "../../../utils/offer/hasMopsConfigured";
import { Section } from "./Section";

export function Methods({
  type,
  meansOfPayment,
}: {
  type: "buy" | "sell";
  meansOfPayment: MeansOfPayment;
}) {
  const navigation = useStackNavigation();
  const onPress = () => navigation.navigate("paymentMethods");
  const hasSelectedMethods = hasMopsConfigured(meansOfPayment);
  const { isDarkMode } = useThemeStore(); // Access dark mode state

  const backgroundColor = isDarkMode
    ? tw.color("card") // Use 'card' color for dark mode
    : type === "buy"
    ? tw.color("success-mild-1-color")
    : tw.color("primary-background-dark-color");

  const color = isDarkMode
    ? tw.color("primary-main") // Use 'primary-main' for icon color in dark mode
    : tw.color("black-100");

  return (
    <>
      {hasSelectedMethods ? (
        <Section.Container
          style={[tw`flex-row items-start`, { backgroundColor }]}
        >
          <MeansOfPayment meansOfPayment={meansOfPayment} style={tw`flex-1`} />
          <TouchableIcon
            id="plusCircle"
            iconSize={24}
            onPress={onPress}
            iconColor={color}
            style={tw`pt-1`}
          />
        </Section.Container>
      ) : (
        <Section.Container style={{ backgroundColor }}>
          <TouchableOpacity
            style={tw`flex-row items-center gap-10px`}
            onPress={onPress}
          >
            <Icon size={24} id="plusCircle" color={color} />
            <PeachText style={[tw`subtitle-1`, { color }]}>
              {i18n.break("paymentMethod.select.button.remote")}
            </PeachText>
          </TouchableOpacity>
        </Section.Container>
      )}
    </>
  );
}