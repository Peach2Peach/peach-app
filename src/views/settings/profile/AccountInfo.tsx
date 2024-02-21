import { View } from "react-native";
import { PeachText } from "../../../components/text/PeachText";
import { CopyAble } from "../../../components/ui/CopyAble";
import tw from "../../../styles/tailwind";
import { PEACH_ID_LENGTH } from "../../../utils/account/PEACH_ID_LENGTH";
import { getDateToDisplay } from "../../../utils/date/getDateToDisplay";
import i18n from "../../../utils/i18n";

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
  return (
    <View style={tw`pr-3`}>
      <PeachText style={tw`lowercase text-black-65`}>
        {i18n("profile.publicKey")}:
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
  return (
    <View>
      <PeachText style={tw`lowercase text-black-65`}>
        {i18n("profile.accountCreated")}:
      </PeachText>
      <PeachText style={tw`subtitle-1`}>
        {getDateToDisplay(creationDate)}
      </PeachText>
    </View>
  );
}

function Disputes({ opened, won, lost, resolved }: User["disputes"]) {
  return (
    <View>
      <PeachText style={tw`lowercase text-black-65`}>
        {i18n("profile.disputes")}:
      </PeachText>
      <View style={tw`flex-row`}>
        {[opened, won, lost, resolved].map((value, index) => (
          <PeachText
            key={`myProfile-disputes-${index}`}
            style={tw`pr-4 lowercase subtitle-1`}
          >
            {value}{" "}
            {i18n(
              `profile.disputes${["Opened", "Won", "Lost", "Resolved"][index]}`,
            )}
          </PeachText>
        ))}
      </View>
    </View>
  );
}

function Trades({ trades }: { trades: number }) {
  return (
    <View>
      <PeachText style={tw`lowercase text-black-65`}>
        {i18n("profile.numberOfTrades")}:
      </PeachText>
      <PeachText style={tw`subtitle-1`}>{trades}</PeachText>
    </View>
  );
}
