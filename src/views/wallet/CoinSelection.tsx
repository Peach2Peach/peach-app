import { TxOut } from "bdk-rn";
import { Fragment, useState } from "react";
import { View } from "react-native";
import { Header } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { BTCAmount } from "../../components/bitcoin/BTCAmount";
import { Button } from "../../components/buttons/Button";
import { Checkbox } from "../../components/inputs/Checkbox";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { HorizontalLine } from "../../components/ui/HorizontalLine";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { HelpPopup } from "../../popups/HelpPopup";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";
import { getUTXOId } from "../../utils/wallet/getUTXOId";
import { useWalletState } from "../../utils/wallet/walletStore";
import { BitcoinLoading } from "../loading/BitcoinLoading";
import { UTXOAddress } from "./components";
import { useUTXOs } from "./hooks/useUTXOs";

export const CoinSelection = () => {
  const storedSelection = useWalletState((state) => state.selectedUTXOIds);
  const [selectedUTXOs, setSelectedUTXOs] = useState(storedSelection);
  const { isLoading } = useUTXOs();

  if (isLoading) {
    return <BitcoinLoading />;
  }

  const toggleSelection = (utxoId: string) => {
    setSelectedUTXOs((previousSelection) => {
      if (previousSelection.includes(utxoId)) {
        return previousSelection.filter(
          (selectedUTXO) => selectedUTXO !== utxoId,
        );
      }
      return [...previousSelection, utxoId];
    });
  };

  return (
    <Screen header={<CoinSelectionHeader />}>
      <UTXOList
        selectedUTXOs={selectedUTXOs}
        toggleSelection={toggleSelection}
      />
      <ConfirmButton selectedUTXOIds={selectedUTXOs} />
    </Screen>
  );
};

type UTXOListProps = {
  selectedUTXOs: string[];
  toggleSelection: (utxoId: string) => void;
};

function CoinSelectionHeader() {
  const setPopup = useSetPopup();
  const showHelp = () => setPopup(<HelpPopup id="coinControl" />);
  return (
    <Header
      title={i18n("wallet.coinControl.title")}
      icons={[
        {
          ...headerIcons.help,
          onPress: showHelp,
          accessibilityHint: i18n("help"),
        },
      ]}
    />
  );
}

function UTXOList({ selectedUTXOs, toggleSelection }: UTXOListProps) {
  const { data: utxos } = useUTXOs();

  return (
    <PeachScrollView
      contentContainerStyle={[tw`grow py-sm`, tw`md:py-md`]}
      contentStyle={tw`gap-4 grow`}
    >
      {utxos &&
        utxos?.map((utxo, index) => (
          <Fragment key={utxo.txout.script.id}>
            <UTXOItem
              txout={utxo.txout}
              toggleSelection={() => toggleSelection(getUTXOId(utxo))}
              isSelected={
                selectedUTXOs.findIndex(
                  (selectedUTXO) => selectedUTXO === getUTXOId(utxo),
                ) !== -1
              }
            />
            {index !== utxos.length - 1 && <HorizontalLine />}
          </Fragment>
        ))}
    </PeachScrollView>
  );
}

type UTXOItemProps = {
  txout: TxOut;
  isSelected: boolean;
  toggleSelection: () => void;
};

function UTXOItem({
  txout: { value: amount, scriptPubkey },
  isSelected,
  toggleSelection,
}: UTXOItemProps) {
  return (
    <View style={tw`flex-row gap-3 px-2`}>
      <View style={tw`flex-1 gap-1`}>
        <BTCAmount size="medium" amount={Number(amount.toSat())} />
        <UTXOAddress script={scriptPubkey} />
      </View>
      <Checkbox
        testID="checkbox"
        onPress={toggleSelection}
        checked={isSelected}
      />
    </View>
  );
}

function ConfirmButton({ selectedUTXOIds }: { selectedUTXOIds: string[] }) {
  const navigation = useStackNavigation();
  const setSelectedUTXOIds = useWalletState(
    (state) => state.setSelectedUTXOIds,
  );

  const onPress = () => {
    setSelectedUTXOIds(selectedUTXOIds);
    navigation.navigate("sendBitcoin");
  };
  return (
    <Button style={tw`self-center`} onPress={onPress}>
      {i18n("confirm")}
    </Button>
  );
}
