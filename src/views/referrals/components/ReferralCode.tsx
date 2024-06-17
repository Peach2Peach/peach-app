import { useTranslate } from "@tolgee/react";
import { View } from "react-native";
import Share from "react-native-share";
import { Button } from "../../../components/buttons/Button";
import { PeachText } from "../../../components/text/PeachText";
import { CopyAble } from "../../../components/ui/CopyAble";
import { useSelfUser } from "../../../hooks/query/useSelfUser";
import tw from "../../../styles/tailwind";
import { languageState } from "../../../utils/i18n";
import { info } from "../../../utils/log/info";
import { getLocalizedLink } from "../../../utils/web/getLocalizedLink";

type Props = {
  referralCode: string;
};

export const ReferralCode = () => {
  const { user } = useSelfUser();
  const referralCode = user?.referralCode;

  if (!referralCode) {
    return <></>;
  }

  const inviteLink = getLocalizedLink(
    `referral?code=${referralCode}`,
    languageState.locale,
  );

  return (
    <View style={tw`gap-4`}>
      <YourCode referralCode={referralCode} />
      <InviteLink inviteLink={inviteLink} />
      <InviteFriendsButton
        referralCode={referralCode}
        inviteLink={inviteLink}
      />
    </View>
  );
};

function YourCode({ referralCode }: Props) {
  const { t } = useTranslate("referral");
  return (
    <View>
      <PeachText style={tw`text-center text-black-65`}>
        {t("referrals.yourCode")}
      </PeachText>
      <View style={tw`flex-row justify-center gap-1`}>
        <PeachText style={tw`text-center h4`}>{referralCode}</PeachText>
        <CopyAble
          value={referralCode}
          style={tw`w-7 h-7`}
          textPosition="bottom"
        />
      </View>
    </View>
  );
}

function InviteLink({ inviteLink }: { inviteLink: string }) {
  const { t } = useTranslate("referral");
  return (
    <View
      style={tw`flex-row items-center justify-between p-4 border rounded-lg border-primary-main`}
    >
      <View>
        <PeachText style={tw`text-black-65`}>
          {t("referrals.inviteLink")}
        </PeachText>
        <PeachText style={tw`text-3xs`}>
          {inviteLink.replace("https://", "")}
        </PeachText>
      </View>
      <CopyAble value={inviteLink} style={tw`w-7 h-7`} />
    </View>
  );
}

function InviteFriendsButton({
  referralCode,
  inviteLink,
}: {
  referralCode: string;
  inviteLink: string;
}) {
  const { t } = useTranslate("referral");
  const inviteFriend = () => {
    Share.open({
      message: t("referrals.inviteText", {
        refCode: referralCode,
        link: inviteLink,
      }),
    }).catch((e) => {
      info("User cancel invite friends share", e);
    });
  };
  return (
    <Button
      style={tw`self-center`}
      textColor={tw.color("primary-main")}
      ghost
      onPress={inviteFriend}
    >
      {t("referrals.inviteFriends")}
    </Button>
  );
}
