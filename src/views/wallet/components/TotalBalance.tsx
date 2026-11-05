import { TouchableOpacity, View } from "react-native";
import { shallow } from "zustand/shallow";
import { Icon } from "../../../components/Icon";
import { Loading } from "../../../components/Loading";
import { Placeholder } from "../../../components/Placeholder";
import { BTCAmount } from "../../../components/bitcoin/BTCAmount";
import { PeachText } from "../../../components/text/PeachText";
import { useBitcoinPrices } from "../../../hooks/useBitcoinPrices";
import { useThemeStore } from "../../../store/theme";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";
import { priceFormat } from "../../../utils/string/priceFormat";
import { useWalletState } from "../../../utils/wallet/walletStore";

type Props = {
  amount: number;
  isRefreshing?: boolean;
};
export const TotalBalance = ({ amount, isRefreshing }: Props) => {
  const [showBalance, toggleShowBalance] = useWalletState(
    (state) => [state.showBalance, state.toggleShowBalance],
    shallow,
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
      <FiatBalance
        amount={amount}
        showAmount={showBalance}
        isRefreshing={isRefreshing}
      />
    </View>
  );
};

function FiatBalance({
  amount,
  showAmount,
  isRefreshing,
}: Props & { showAmount: boolean }) {
  const { bitcoinPrice, fiatPrice, displayCurrency } = useBitcoinPrices(amount);
  if (!amount || !bitcoinPrice || displayCurrency === "SAT") return null;

  return (
    <PeachText
      style={[
        tw`-mt-2 text-center body-m text-black-50`,
        isRefreshing && tw`opacity-50`,
      ]}
    >
      {showAmount ? priceFormat(fiatPrice) : "••••"} {displayCurrency}
    </PeachText>
  );
}
