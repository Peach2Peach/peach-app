import { View } from "react-native";
import { PeachText } from "../../../components/text/PeachText";
import { CopyAble } from "../../../components/ui/CopyAble";
import { ProgressDonut } from "../../../components/ui/ProgressDonut";
import { useThemeStore } from "../../../store/theme";
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
    {"freeTrades" in user && !!user.freeTrades && !!user.maxFreeTrades && (
      <ProgressDonut
        title={i18n("settings.referrals.noPeachFees.freeTrades")}
        value={user.freeTrades}
        max={user.maxFreeTrades}
      />
    )}
  </View>
);

function PublicKey({ publicKey }: { publicKey: string }) {
  const { isDarkMode } = useThemeStore();
  return (
    <View style={tw`pr-3`}>
      <PeachText
        style={tw.style(
          `lowercase`,
          isDarkMode ? "text-backgroundLight-light" : "text-black-50",
        )}
      >
        {i18n("profile.publicKey")}:
      </PeachText>
      <View style={tw`flex-row items-center gap-3`}>
        <PeachText
          style={tw.style(
            `uppercase subtitle-2 shrink`,
            isDarkMode ? "text-black-25" : "text-black-100",
          )}
        >
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
  const { isDarkMode } = useThemeStore();
  return (
    <View>
      <PeachText
        style={tw.style(
          `lowercase`,
          isDarkMode ? "text-backgroundLight-light" : "text-black-50",
        )}
      >
        {i18n("profile.accountCreated")}:
      </PeachText>
      <PeachText
        style={tw.style(
          `subtitle-1`,
          isDarkMode ? "text-primary-mild-1" : "text-black-100",
        )}
      >
        {getDateToDisplay(creationDate)}
      </PeachText>
    </View>
  );
}

function Disputes({ opened, won, lost, resolved }: User["disputes"]) {
  const { isDarkMode } = useThemeStore();
  return (
    <View>
      <PeachText
        style={tw.style(
          `lowercase`,
          isDarkMode ? "text-backgroundLight-light" : "text-black-50",
        )}
      >
        {i18n("profile.disputes")}:
      </PeachText>
      <View style={tw`flex-row`}>
        {[opened, won, lost, resolved].map((value, index) => (
          <PeachText
            key={`myProfile-disputes-${index}`}
            style={tw.style(
              `pr-4 lowercase subtitle-1`,
              isDarkMode ? "text-primary-mild-1" : "text-black-100",
            )}
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
  const { isDarkMode } = useThemeStore();
  return (
    <View>
      <PeachText
        style={tw.style(
          `lowercase`,
          isDarkMode ? "text-backgroundLight-light" : "text-black-50",
        )}
      >
        {i18n("profile.numberOfTrades")}:
      </PeachText>
      <PeachText
        style={tw.style(
          `subtitle-1`,
          isDarkMode ? "text-primary-mild-1" : "text-black-100",
        )}
      >
        {trades}
      </PeachText>
    </View>
  );
}
