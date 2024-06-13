import { useQuery } from "@tanstack/react-query";
import { useTranslate } from "@tolgee/react";
import { useState } from "react";
import { View } from "react-native";
import { Header } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { RadioButtons } from "../../components/inputs/RadioButtons";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { PeachText } from "../../components/text/PeachText";
import { Progress } from "../../components/ui/Progress";
import { useSelfUser } from "../../hooks/query/useSelfUser";
import { InfoPopup } from "../../popups/InfoPopup";
import { CustomReferralCodePopup } from "../../popups/referral/CustomReferralCodePopup";
import { RedeemNoPeachFeesPopup } from "../../popups/referral/RedeemNoPeachFeesPopup";
import tw from "../../styles/tailwind";
import { headerIcons } from "../../utils/layout/headerIcons";
import { peachAPI } from "../../utils/peachAPI";
import { systemKeys } from "../addPaymentMethod/usePaymentMethodInfo";
import { ReferralCode } from "./components/ReferralCode";

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
  const { data: REWARDINFO } = useReferralRewardsInfo();
  const [selectedReward, setSelectedReward] = useState<RewardType>();
  if (!REWARDINFO) return null;

  const hasSufficientBalance =
    balance >= Math.min(REWARDINFO.REFERRALCODE, REWARDINFO.FREETRADES);

  const createReward = (
    id: RewardType,
    requiredPoints: number,
    disabled: boolean,
  ) => ({
    value: id,
    disabled,
    display: <RewardItem reward={{ id, requiredPoints }} />,
  });

  const rewards = [
    createReward(
      "customReferralCode",
      REWARDINFO.REFERRALCODE,
      balance < REWARDINFO.REFERRALCODE,
    ),
    createReward(
      "noPeachFees",
      REWARDINFO.FREETRADES,
      balance < REWARDINFO.FREETRADES,
    ),
    createReward("sats", REWARDINFO.SATS, true),
  ];

  return (
    <>
      <PeachText style={tw`text-center`}>
        {t(
          hasSufficientBalance
            ? "referrals.selectReward"
            : "referrals.continueSaving",
          { ns: "referral" },
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

function RewardItem({ reward }: { reward: Reward }) {
  const { t: i18n } = useTranslate("referral");
  return (
    <View style={tw`flex-row items-center justify-between py-1`}>
      <PeachText style={tw`subtitle-1`}>
        {i18n(`referrals.reward.${reward.id}`)}
      </PeachText>
      <PeachText style={tw`text-black-65`}>({reward.requiredPoints})</PeachText>
    </View>
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

function useReferralRewardsInfo() {
  return useQuery({
    queryKey: systemKeys.referralRewards(),
    queryFn: async () => {
      const { result, error } =
        await peachAPI.public.system.getReferralRewardsInfo();
      if (error) {
        throw error;
      }
      return result;
    },
  });
}
