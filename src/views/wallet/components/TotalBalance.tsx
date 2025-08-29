import { TouchableOpacity, View } from "react-native";
import { useShallow } from "zustand/shallow";
import { Icon } from "../../../components/Icon";
import { Loading } from "../../../components/Loading";
import { Placeholder } from "../../../components/Placeholder";
import { BTCAmount } from "../../../components/bitcoin/BTCAmount";
import { PeachText } from "../../../components/text/PeachText";
import { useThemeStore } from "../../../store/theme";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";
import { useWalletState } from "../../../utils/wallet/walletStore";

type Props = {
  amount: number;
  isRefreshing?: boolean;
};
export const TotalBalance = ({ amount, isRefreshing }: Props) => {
  const [showBalance, toggleShowBalance] = useWalletState(
    useShallow((state) => [state.showBalance, state.toggleShowBalance]),
  );
  const { isDarkMode } = useThemeStore();

  return (
    <View style={tw`items-center self-stretch justify-center gap-4 grow`}>
      <View
        style={[
          tw`flex-row items-center self-stretch justify-center gap-14px`,
          isRefreshing && tw`opacity-50`,
        ]}
      >
        <Placeholder style={tw`w-5 h-5`} />
        <PeachText
          style={[
            tw`text-center button-medium`,

            isDarkMode ? tw`text-primary-mild-1` : tw`text-black-100`,
          ]}
        >
          {i18n("wallet.totalBalance")}:
        </PeachText>
        <TouchableOpacity
          accessibilityHint={i18n(
            showBalance ? "wallet.hideBalance" : "wallet.showBalance",
          )}
          onPress={toggleShowBalance}
        >
          <Icon
            id={showBalance ? "eyeOff" : "eye"}
            size={20}
            color={tw.color("black-50")}
          />
        </TouchableOpacity>
      </View>
      {isRefreshing && <Loading style={tw`absolute`} size="large" />}
      <BTCAmount
        amount={amount}
        size="large"
        showAmount={showBalance}
        style={isRefreshing && tw`opacity-50`}
      />
    </View>
  );
};
