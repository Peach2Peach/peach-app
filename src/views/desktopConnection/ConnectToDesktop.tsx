import { NETWORK } from "@env";
import { useState } from "react";
import { View } from "react-native";
import { Header } from "../../components/Header";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { ScanQR } from "../../components/camera/ScanQR";
import { useSetPopup } from "../../components/popup/GlobalPopup";
import { ParsedPeachText } from "../../components/text/ParsedPeachText";
import { PeachText } from "../../components/text/PeachText";
import { useQRScanner } from "../../hooks/useQRScanner";
import { InfoPopup } from "../../popups/InfoPopup";
import { useConfigStore } from "../../store/configStore/configStore";
import tw from "../../styles/tailwind";
import { useAccountStore } from "../../utils/account/account";
import { loadWalletFromAccount } from "../../utils/account/loadWalletFromAccount";
import { encryptAndSubmitDesktopConnectionData } from "../../utils/desktopConnection/encryptAndSubmitDesktopConnectionData";
import { parseDesktopConnectionQRCode } from "../../utils/desktopConnection/parseDesktopConnectionQRCode";
import i18n from "../../utils/i18n";
import { headerIcons } from "../../utils/layout/headerIcons";

export const ConnectToDesktop = () => {
  const [failed, setFailed] = useState(false);
  const [success, setSuccess] = useState(false);

  const peachPGPPublicKey = useConfigStore((state) => state.peachPGPPublicKey);
  const account = useAccountStore.getState().account;
  if (!account.mnemonic) throw Error("");
  const mnemonic = account.mnemonic;

  const wallet = loadWalletFromAccount({ ...account, mnemonic });
  const xpub = wallet
    .derivePath(`m/84'/${NETWORK === "bitcoin" ? "0" : "1"}'/0'`)
    .neutered()
    .toBase58();

  const onSuccess = async (data: string) => {
    const desktopConnectionData = parseDesktopConnectionQRCode(data);

    if (desktopConnectionData) {
      await encryptAndSubmitDesktopConnectionData(
        desktopConnectionData,
        peachPGPPublicKey,
        account.pgp.privateKey,
        xpub,
      );

      setSuccess(true);
    } else {
      setFailed(true);
    }
  };
  const { showQRScanner, showQR, closeQR, onRead } = useQRScanner({
    onSuccess,
    initialState: true,
  });

  const [hasran, sethasran] = useState(false);
  if (!hasran) {
    sethasran(true);
  }
  if (showQRScanner) return <ScanQR onRead={onRead} onCancel={closeQR} />;

  return (
    <Screen header={<ConnectToDesktopHeader />}>
      <PeachScrollView contentContainerStyle={[tw`grow py-sm`, tw`md:py-md`]}>
        <View style={[tw`pb-11 gap-4`, tw`md:pb-14`]}>
          <PeachText>It was scanned!!</PeachText>
        </View>
        {failed && (
          <PeachText>Something went wrong, please try again</PeachText>
        )}
        {success && <PeachText>You should be authenticated now!</PeachText>}
      </PeachScrollView>
    </Screen>
  );
};

function ConnectToDesktopHeader() {
  const setPopup = useSetPopup();
  const showHelp = () => setPopup(<DesktopConnectionHelp />);

  return (
    <Header
      title={i18n("desktopConnection.title")}
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

function DesktopConnectionHelp() {
  return (
    <InfoPopup
      title={i18n("desktopConnection.help.title")}
      content={
        <ParsedPeachText
          style={tw`text-black-100`}
          parse={[
            {
              pattern: new RegExp(
                i18n("desktopConnection.help.text.link"),
                "u",
              ),
              style: tw`underline`,
            },
          ]}
        >
          {i18n("desktopConnection.help.text")}
        </ParsedPeachText>
      }
    />
  );
}
