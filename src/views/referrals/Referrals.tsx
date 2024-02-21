import { useState } from "react";
import { View } from "react-native";
import { Header } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import {
  RadioButtonItem,
  RadioButtons,
} from "../../components/inputs/RadioButtons";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { PeachText } from "../../components/text/PeachText";
import { Progress } from "../../components/ui/Progress";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { InfoPopup } from "../../popups/InfoPopup";
import { CustomReferralCodePopup } from "../../popups/referral/CustomReferralCodePopup";
import { RedeemNoPeachFeesPopup } from "../../popups/referral/RedeemNoPeachFeesPopup";
import tw from "../../styles/tailwind";
import { headerIcons } from "../../utils/layout/headerIcons";
import { thousands } from "../../utils/string/thousands";
import { ReferralCode } from "./components/ReferralCode";
import { REWARDINFO } from "./constants";
import { isRewardAvailable } from "./helpers/isRewardAvailable";
import { mapRewardsToRadioButtonItems } from "./helpers/mapRewardsToRadioButtonItems";
import { useTranslate } from "@tolgee/react";

export const Referrals = () => (
  <Screen header={<ReferralsHeader />}>
    <BonusPointsBar />
    <PeachScrollView
      contentContainerStyle={tw`justify-center grow`}
      contentStyle={tw`gap-4 py-4`}
    >
      <ReferralRewards />
      <ReferralCode />
    </PeachScrollView>
  </Screen>
);

function ReferralsHeader() {
  const { t } = useTranslate("settings");
  const setPopup = useSetPopup();
  const showHelp = () => setPopup(<ReferralsPopup />);
  return (
    <Header
      title={t("settings.referrals")}
      icons={[{ ...headerIcons.help, onPress: showHelp }]}
    />
  );
}

function ReferralsPopup() {
  const { t } = useTranslate("help");
  return (
    <InfoPopup
      title={t("help.referral.title")}
      content={
        <>
          <PeachText style={tw`mb-2`}>
            {t("help.referral.description.1")}
          </PeachText>
          <PeachText>{t("help.referral.description.2")}</PeachText>
        </>
      }
    />
  );
}

function ReferralRewards() {
  const { t } = useTranslate("global");
  const { user } = useSelfUser();
  const balance = user?.bonusPoints || 0;
  const referredTradingAmount = user?.referredTradingAmount || 0;

  const availableRewards = REWARDINFO.filter((reward) =>
    isRewardAvailable(reward, balance),
  ).length;
  const [selectedReward, setSelectedReward] = useState<RewardType>();

  const rewards: RadioButtonItem<RewardType>[] =
    mapRewardsToRadioButtonItems(balance);

  return (
    <>
      <PeachText style={tw`text-center`}>
        {t(
          !referredTradingAmount
            ? "referrals.notTraded"
            : "referrals.alreadyTraded",
          t("currency.format.sats", {
            amount: thousands(referredTradingAmount),
          }),
        )}
        {"\n\n"}
        {t(
          availableRewards
            ? "referrals.selectReward"
            : "referrals.continueSaving",
        )}
      </PeachText>
      <RadioButtons
        items={rewards}
        selectedValue={selectedReward}
        onButtonPress={setSelectedReward}
      />
      <RedeemButton selectedReward={selectedReward} />
    </>
  );
}

function RedeemButton({
  selectedReward,
}: {
  selectedReward: RewardType | undefined;
}) {
  const { t } = useTranslate("referral");
  const setPopup = useSetPopup();
  const redeem = () => {
    if (selectedReward === "customReferralCode") {
      setPopup(<CustomReferralCodePopup />);
    } else if (selectedReward === "noPeachFees") {
      setPopup(<RedeemNoPeachFeesPopup />);
    }
  };
  return (
    <Button
      style={tw`self-center`}
      disabled={!selectedReward}
      onPress={redeem}
      iconId={"gift"}
    >
      {t("referrals.reward.select")}
    </Button>
  );
}

function BonusPointsBar() {
  const { t } = useTranslate("referral");
  const BARLIMIT = 400;
  const { user } = useSelfUser();
  const balance = user?.bonusPoints || 0;

  return (
    <View>
      <Progress
        style={tw`h-3 rounded`}
        backgroundStyle={tw`border-2 bg-primary-mild-1 border-primary-background-main`}
        barStyle={tw`border-2 bg-primary-main border-primary-background-main`}
        percent={balance / BARLIMIT}
      />
      <PeachText style={tw`pl-2 tooltip text-black-65`}>
        {t("referrals.points")}
        {": "}
        <PeachText style={tw`font-bold tooltip text-black-65`}>
          {balance}
        </PeachText>
      </PeachText>
    </View>
  );
}
