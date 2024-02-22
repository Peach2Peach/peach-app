import { useTranslate } from "@tolgee/react";
import { View } from "react-native";
import { PeachText } from "../../../components/text/PeachText";
import { CopyAble } from "../../../components/ui/CopyAble";
import tw from "../../../styles/tailwind";
import { PEACH_ID_LENGTH } from "../../../utils/account/PEACH_ID_LENGTH";
import { getDateToDisplay } from "../../../utils/date/getDateToDisplay";

type Props = {
  user: User | PublicUser;
};

export const AccountInfo = ({ user }: Props) => (
  <View style={tw`gap-4 pl-1`}>
    <PublicKey publicKey={user.id} />
    <AccountCreated {...user} />
    <Disputes {...user.disputes} />
    <Trades trades={user.trades} />
  </View>
);

function PublicKey({ publicKey }: { publicKey: string }) {
  const { t } = useTranslate("profile");

  return (
    <View style={tw`pr-3`}>
      <PeachText style={tw`lowercase text-black-65`}>
        {t("profile.publicKey")}:
      </PeachText>
      <View style={tw`flex-row items-center gap-3`}>
        <PeachText style={tw`uppercase text-black-100 subtitle-2 shrink`}>
          <PeachText style={tw`text-primary-main subtitle-2`}>
            {publicKey.slice(0, PEACH_ID_LENGTH)}
          </PeachText>
          {publicKey.slice(PEACH_ID_LENGTH)}
        </PeachText>

        <CopyAble style={tw`w-7 h-7`} value={publicKey} />
      </View>
    </View>
  );
}

function AccountCreated({ creationDate }: { creationDate: Date }) {
  const { t } = useTranslate("profile");
  return (
    <View>
      <PeachText style={tw`lowercase text-black-65`}>
        {t("profile.accountCreated")}:
      </PeachText>
      <PeachText style={tw`subtitle-1`}>
        {getDateToDisplay(creationDate)}
      </PeachText>
    </View>
  );
}

function Disputes({ opened, won, lost, resolved }: User["disputes"]) {
  const { t } = useTranslate("profile");
  return (
    <View>
      <PeachText style={tw`lowercase text-black-65`}>
        {t("profile.disputes")}:
      </PeachText>
      <View style={tw`flex-row`}>
        {[opened, won, lost, resolved].map((value, index) => (
          <PeachText
            key={`myProfile-disputes-${index}`}
            style={tw`pr-4 lowercase subtitle-1`}
          >
            {value}{" "}
            {t(
              // @ts-ignore
              `profile.disputes${["Opened", "Won", "Lost", "Resolved"][index]}`,
            )}
          </PeachText>
        ))}
      </View>
    </View>
  );
}

function Trades({ trades }: { trades: number }) {
  const { t } = useTranslate("profile");
  return (
    <View>
      <PeachText style={tw`lowercase text-black-65`}>
        {t("profile.numberOfTrades")}:
      </PeachText>
      <PeachText style={tw`subtitle-1`}>{trades}</PeachText>
    </View>
  );
}
