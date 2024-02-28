import { networks } from "bitcoinjs-lib";
import { useCallback, useMemo, useState } from "react";
import { Image, LayoutChangeEvent, TouchableOpacity, View } from "react-native";
import txInMempool from "../../../assets/escrow/tx-in-mempool.png";
import { Header } from "../../../components/Header";
import { Icon } from "../../../components/Icon";
import { Screen } from "../../../components/Screen";
import { TradeInfo } from "../../../components/offer/TradeInfo";
import { useSetPopup } from "../../../components/popup/GlobalPopup";
import { PeachText } from "../../../components/text/PeachText";
import { CancelOfferPopup } from "../../../popups/CancelOfferPopup";
import { HelpPopup } from "../../../popups/HelpPopup";
import tw from "../../../styles/tailwind";
import { showTransaction } from "../../../utils/blockchain/showTransaction";
import i18n from "../../../utils/i18n";
import { headerIcons } from "../../../utils/layout/headerIcons";
import { generateBlock } from "../../../utils/regtest/generateBlock";
import { generateLiquidBlock } from "../../../utils/regtest/generateLiquidBlock";
import { isLiquidAddress } from "../../../utils/validation/rules";
import { getLiquidNetwork } from "../../../utils/wallet/getLiquidNetwork";
import { getNetwork } from "../../../utils/wallet/getNetwork";

type Props = {
  offerId: string;
  address: string;
  txId: string;
};

const DEFAULT_WIDTH = 300;
const ASPECT_RATIO = 0.7;

export const TransactionInMempool = ({ offerId, address, txId }: Props) => {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const openInExplorer = () =>
    showTransaction(
      txId,
      isLiquidAddress(address, getLiquidNetwork()) ? "liquid" : "bitcoin",
    );
  const onLayout = (e: LayoutChangeEvent) =>
    setWidth(e.nativeEvent.layout.width);

  return (
    <Screen header={<MempoolHeader {...{ offerId }} />}>
      <View style={tw`justify-center gap-3 grow shrink`}>
        <PeachText>{i18n("sell.funding.mempool.description")}</PeachText>
        <View {...{ onLayout }} testID="image-container">
          <Image
            source={txInMempool}
            style={{ width, height: width * ASPECT_RATIO }}
            resizeMode="contain"
          />
        </View>
        <TouchableOpacity onPress={openInExplorer}>
          <TradeInfo
            style={tw`self-center`}
            text={i18n("showInExplorer")}
            textStyle={tw`underline`}
            IconComponent={
              <Icon
                id="externalLink"
                style={tw`w-5 h-5`}
                color={tw.color("primary-main")}
              />
            }
          />
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

function MempoolHeader({ offerId }: { offerId: string }) {
  const setPopup = useSetPopup();
  const showHelp = useCallback(
    () => setPopup(<HelpPopup id="mempool" />),
    [setPopup],
  );
  const cancelOffer = useCallback(
    () => setPopup(<CancelOfferPopup offerId={offerId} />),
    [offerId, setPopup],
  );

  const memoizedHeaderIcons = useMemo(() => {
    const icons = [
      { ...headerIcons.help, onPress: showHelp },
      { ...headerIcons.cancel, onPress: cancelOffer },
    ];

    if (getNetwork() === networks.regtest) {
      return [
        {
          ...headerIcons.generateLiquidBlock,
          onPress: generateLiquidBlock,
        },
        { ...headerIcons.generateBlock, onPress: generateBlock },
        ...icons,
      ];
    }
    return icons;
  }, [cancelOffer, showHelp]);

  return (
    <Header
      title={i18n("sell.funding.mempool.title")}
      icons={memoizedHeaderIcons}
    />
  );
}
