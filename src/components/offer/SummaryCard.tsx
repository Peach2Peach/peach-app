import { View } from "react-native";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { Icon } from "../Icon";
import { PeachText } from "../text/PeachText";
import { MeansOfPayment } from "./MeansOfPayment";

export const SummaryCard = ({ children }: ComponentProps) => {
  const { isDarkMode } = useThemeStore();

  return (
    <View
      style={tw.style(
        "items-center gap-4 px-5 border border-black-10 rounded-2xl py-7",
        isDarkMode ? "bg-transparent" : "bg-primary-background-light-color",
      )}
    >
      {children}
    </View>
  );
};

const SummarySection = ({ children }: ComponentProps) => (
  <View style={tw`items-center gap-1`}>{children}</View>
);

SummaryCard.Section = SummarySection;

const PaymentMethods = ({
  meansOfPayment,
  setDisplayedCurrency,
  offerPaymentData,
}: {
  meansOfPayment: MeansOfPayment;
  offerPaymentData: OfferPaymentData;
  setDisplayedCurrency: Function;
}) => (
  <SummaryCard.Section>
    <PeachText style={tw`text-center text-black-65`}>
      {i18n("offer.summary.withTheseMethods")}
    </PeachText>
    <MeansOfPayment
      meansOfPayment={meansOfPayment}
      offerPaymentData={offerPaymentData}
      style={tw`self-stretch`}
      setDisplayedCurrency={setDisplayedCurrency}
      setCurrency={() => {}}
    />
  </SummaryCard.Section>
);

SummaryCard.PaymentMethods = PaymentMethods;

const ExperienceLevelAndInstantTrade = ({
  isInstantTrade,
  experienceLevelCriteria,
}: {
  isInstantTrade: boolean;
  experienceLevelCriteria?: ExperienceLevel;
}) => {
  const iconLabel = isInstantTrade ? "check" : "x";
  return (
    <SummaryCard.Section>
      <View style={tw`flex-row justify-between`}>
        {/* Left Section */}
        <View style={tw`flex-1 items-center justify-center`}>
          <PeachText style={tw`text-black-65 mb-1`}>
            {i18n("offerPreferences.instantTrade")}
          </PeachText>
          <View style={tw`flex-row items-center`}>
            {isInstantTrade && (
              <Icon
                id={iconLabel}
                size={14}
                style={[tw`ml-1`, { opacity: 0 }]}
              />
            )}
            <PeachText
              style={tw`subtitle-1 text-${isInstantTrade ? "success" : "back"}-main`}
            >
              {isInstantTrade ? "yes" : "no"}
            </PeachText>
            {isInstantTrade && (
              <Icon
                id={iconLabel}
                color={tw.color(
                  isInstantTrade ? "success-main" : "primary-main",
                )}
                size={14}
                style={tw`ml-1`}
              />
            )}
          </View>
        </View>

        {/* Right Section */}
        <View style={tw`flex-1 items-center justify-center`}>
          <PeachText style={tw`text-black-65`}>
            {i18n("offer.summary.availableTo")}
          </PeachText>
          <PeachText style={tw`subtitle-1`}>
            {i18n(
              "offer.summary.availableTo." +
                (experienceLevelCriteria
                  ? experienceLevelCriteria
                  : "everyone"),
            )}
          </PeachText>
        </View>
      </View>
    </SummaryCard.Section>
  );
};
SummaryCard.ExperienceLevelAndInstantTrade = ExperienceLevelAndInstantTrade;
