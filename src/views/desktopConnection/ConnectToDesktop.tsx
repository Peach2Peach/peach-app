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
import { goToShiftCrypto } from "../../utils/web/goToShiftCrypto";

export const ConnectToDesktop = () => {
  const [failed, setFailed] = useState(false);
  const [success, setSuccess] = useState(false);

  const peachPGPPublicKey = useConfigStore((state) => state.peachPGPPublicKey);
  const account = useAccountStore.getState().account;
  if (!account.mnemonic) throw Error("");
  const mnemonic = account.mnemonic;

  // if (!account.mnemonic) throw Error("");

  const wallet = loadWalletFromAccount({ ...account, mnemonic });
  const xpub = wallet
    .derivePath(`m/84'/${NETWORK === "bitcoin" ? "0" : "1"}'/0'`)
    .neutered()
    .toBase58();

  console.log("xpub", xpub);

  const onSuccess = async (data: string) => {
    const desktopConnectionData = parseDesktopConnectionQRCode(data);
    console.log("desktopConnectionData", desktopConnectionData);

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

  // const fakeData = `{"desktopConnectionId":"e84468ad-2192-4416-bdba-4e719e4acd73","ephemeralPgpPublicKey":"LS0tLS1CRUdJTiBQR1AgUFVCTElDIEtFWSBCTE9DSy0tLS0tCgp4ak1FYWJGY3ZCWUpLd1lCQkFIYVJ3OEJBUWRBWnBJTVpETGhKM20zTU5rUGVXaFdTSEFXdmRhK3J1UTgKSE5DZnZSYmZvNXZOQ1dWd2FHVnRaWEpoYk1MQUV3UVRGZ29BaFFXQ2FiRmN2QU1MQ1FjSkVBc2NGdjIxCkNJKzFSUlFBQUFBQUFCd0FJSE5oYkhSQWJtOTBZWFJwYjI1ekxtOXdaVzV3WjNCcWN5NXZjbWRNa0FJZQpwYWdBd3VJVERjYjl4M3dKdmJhSjBEKzUxTXlac0JFeFRjWDZzd1VWQ2dnT0RBUVdBQUlCQWhrQkFwc0QKQWg0QkZpRUVQSjBpSnhxODB2UWdCa2M5Q3h3Vy9iVUlqN1VBQUZSa0FRQ0dsSk9vTzBXMUdFa0YzZjZ4CjE2c3F0MnZIUHk5amNXTDI3bTdoWXhjVjZ3RDlHSkF6eTNtM2lTZ0pIL1ZqUHpaOXRwbS8vQUtxYW9iMgpTQVBWaFFPYVl3M09PQVJwc1Z5OEVnb3JCZ0VFQVpkVkFRVUJBUWRBUU9GY0kyM0lCZTlHdkh2cjRsQXYKYkt4NVBLN1JjdHFqcFJnMFhEMW5nUVlEQVFnSHdyNEVHQllLQUhBRmdtbXhYTHdKRUFzY0Z2MjFDSSsxClJSUUFBQUFBQUJ3QUlITmhiSFJBYm05MFlYUnBiMjV6TG05d1pXNXdaM0JxY3k1dmNtY0dpeWJNbE1pSQpkUG13L1NWbk5GYkhQVUt2ZEVDRXB1czRiVlg0M3Zubm9nS2JEQlloQkR5ZElpY2F2TkwwSUFaSFBRc2MKRnYyMUNJKzFBQUJLaFFFQTFTMHYxR3lHVEZPb2ZYU0ozMFg5WDljbDRMNG9XcGpBVUo3UEdZbXVQWmNBCi8zUEkwSlZxc29hdXdCNHhOMGJVMG9mYXVNeGdSQS9yTHR1RllBajR6cEFGCj05SERGCi0tLS0tRU5EIFBHUCBQVUJMSUMgS0VZIEJMT0NLLS0tLS0K","peachDesktopConnectionVersion":1}`;

  // const printData = async () => {
  //   console.log("PEACH APP PGP PRIV KEY", account.pgp.privateKey);
  //   console.log("PEACH APP PGP pub KEY", account.pgp.publicKey);
  //   const derivedPubKey = await OpenPGP.convertPrivateKeyToPublicKey(
  //     account.pgp.privateKey,
  //   );

  //   console.log("DERIVED!!! PEACH APP PGP pub KEY", derivedPubKey);
  // };

  // printData();

  const [hasran, sethasran] = useState(false);
  if (!hasran) {
    sethasran(true);
    // onSuccess(fakeData);
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
  // const navigation = useStackNavigation();
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
              onPress: goToShiftCrypto,
            },
          ]}
        >
          {i18n("desktopConnection.help.text")}
        </ParsedPeachText>
      }
    />
  );
}
