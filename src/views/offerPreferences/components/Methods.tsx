import { TouchableOpacity } from "react-native";
import { Icon } from "../../../components/Icon";
import { TouchableIcon } from "../../../components/TouchableIcon";
import { MeansOfPayment } from "../../../components/offer/MeansOfPayment";
import { PeachText } from "../../../components/text/PeachText";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { useThemeStore } from "../../../store/theme";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";
import { hasMopsConfigured } from "../../../utils/offer/hasMopsConfigured";
import { Section } from "./Section";

export function Methods({
  type,
  meansOfPayment,
  expressFilter,
}: {
  type: "buy" | "sell";
  meansOfPayment: MeansOfPayment;
  expressFilter: boolean;
}) {
  const navigation = useStackNavigation();
  const onPress = () =>
    navigation.navigate("paymentMethods", {
      expressFilter: expressFilter ? type : undefined,
    });
  const hasSelectedMethods = hasMopsConfigured(meansOfPayment);
  const { isDarkMode } = useThemeStore();

  const backgroundColor = isDarkMode
    ? tw.color("card")
    : type === "buy"
      ? tw.color("success-mild-1")
      : tw.color("primary-background-dark");

  const color = isDarkMode
    ? tw.color("primary-main")
    : type === "buy"
      ? tw.color("success-main")
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
