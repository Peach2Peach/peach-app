import { View } from "react-native";
import {
  defaultPreferences,
  useOfferPreferences,
} from "../store/offerPreferenes/useOfferPreferences";
import tw from "../styles/tailwind";
import i18n, { useI18n } from "../utils/i18n";
import { Drawer } from "./Drawer";
import { PriceSection } from "./ExpressBuyAdvancedFilters";
import { ToggleOfferNotifications } from "./ToggleOfferNotifications";
import { Button } from "./buttons/Button";
import { HorizontalLine } from "./ui/HorizontalLine";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ExpressBuyPremiumDrawer({ isOpen, onClose }: Props) {
  useI18n();
  const [expressBuyFilterMaxPremium, setExpressBuyFilterMaxPremium] =
    useOfferPreferences((state) => [
      state.expressBuyFilterMaxPremium,
      state.setExpressBuyFilterMaxPremium,
    ]);

  const isFiltered =
    expressBuyFilterMaxPremium !==
    defaultPreferences.expressBuyFilterMaxPremium;

  const onReset = () =>
    setExpressBuyFilterMaxPremium(
      defaultPreferences.expressBuyFilterMaxPremium,
    );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={i18n("premiumslashdiscount")}
    >
      <View style={tw`gap-4`}>
        <HorizontalLine />
        <PriceSection />
        <ToggleOfferNotifications />
        <Button
          textColor={tw.color(isFiltered ? "success-main" : "black-50")}
          style={tw`py-1 border md:py-2`}
          disabled={!isFiltered}
          onPress={onReset}
          ghost
        >
          {i18n("resetAll")}
        </Button>
      </View>
    </Drawer>
  );
}
