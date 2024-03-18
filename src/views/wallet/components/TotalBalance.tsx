import { useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { shallow } from "zustand/shallow";
import { Icon } from "../../../components/Icon";
import { Placeholder } from "../../../components/Placeholder";
import { Loading } from "../../../components/animation/Loading";
import { BTCAmount } from "../../../components/bitcoin/BTCAmount";
import { Dropdown } from "../../../components/inputs/Dropdown";
import { NumberInput } from "../../../components/inputs/NumberInput";
import { PeachText } from "../../../components/text/PeachText";
import { SATSINBTC } from "../../../constants";
import { useMarketPrices } from "../../../hooks/query/useMarketPrices";
import { CURRENCIES } from "../../../paymentMethods";
import { useSettingsStore } from "../../../store/settingsStore/useSettingsStore";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";
import { useWalletState } from "../../../utils/wallet/walletStore";
import { getFiatPrice } from "../helpers/getFiatPrice";

const hiddenBalance = SATSINBTC.toString()
  .split("")
  .map((_) => "•")
  .join("");

type Props = {
  amount: number;
  isRefreshing?: boolean;
  chain: Chain;
};
export const TotalBalance = ({ amount, chain, isRefreshing }: Props) => {
  const [showBalance, toggleShowBalance] = useWalletState(
    (state) => [state.showBalance, state.toggleShowBalance],
    shallow,
  );
  const displayCurrency = useSettingsStore((state) => state.displayCurrency);
  const { data: prices = {} } = useMarketPrices();
  const [currency, setCurreny] = useState(displayCurrency);
  const price = prices[currency] || 0;
  const fiat = useMemo(() => getFiatPrice(amount, price), [amount, price]);

  return (
    <View style={tw`items-center self-stretch justify-center gap-4 grow`}>
      <View
        style={[
          tw`flex-row items-center self-stretch justify-center gap-14px`,
          isRefreshing && tw`opacity-50`,
        ]}
      >
        <Placeholder style={tw`w-5 h-5`} />
        <PeachText style={tw`text-center button-medium`}>
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
      {isRefreshing && <Loading style={tw`absolute w-16 h-16`} />}
      <BTCAmount
        amount={amount}
        size="large"
        chain={chain}
        showAmount={showBalance}
        style={isRefreshing && tw`opacity-50`}
      />
      <View style={tw`flex-row gap-2`}>
        <View style={tw`flex-shrink`}>
          <NumberInput
            accessibilityHint={i18n("form.lightningInvoice.fiat.label")}
            decimals={2}
            value={showBalance ? fiat : hiddenBalance}
          />
        </View>
        <View style={tw`h-42px`}>
          <Dropdown
            value={currency}
            onChange={setCurreny}
            options={CURRENCIES}
          />
        </View>
      </View>
    </View>
  );
};
