import OpenPGP from "react-native-fast-openpgp";
import { v4 as uuidv4 } from "uuid";
import { peachAPI } from "../peachAPI";
import { DesktopConnectionQRCode } from "./parseDesktopConnectionQRCode";

export async function encryptAndSubmitDesktopConnectionData(
  desktopConnectionScannedData: DesktopConnectionQRCode,
  peachPGPPublicKey: string,
  myPgpPrivateKey: string,
  myXpub: string,
): Promise<void> {
  const validationPassword = uuidv4();

  // get the data

  const dataToSendToDesktop = {
    validationPassword,
    pgpPrivateKey: myPgpPrivateKey,
    xpub: myXpub,
  };

  const dataToSendToDesktopString = JSON.stringify(dataToSendToDesktop);

  const dataToSendToDesktopStringEncrypted = await OpenPGP.encrypt(
    dataToSendToDesktopString,
    desktopConnectionScannedData.ephemeralPgpPublicKey,
  );

  const dataToSendToDesktopStringSignature = await OpenPGP.sign(
    dataToSendToDesktopString,
    myPgpPrivateKey,
    "",
  );

  // encrypt the password for Peach

  const validationPasswordEncrypted = await OpenPGP.encrypt(
    validationPassword,
    peachPGPPublicKey,
  );
  const validationPasswordSignature = await OpenPGP.sign(
    validationPassword,
    myPgpPrivateKey,
    "",
  );

  // submit everything

  await peachAPI.private.peach069.submitDesktopConnectionData({
    id: desktopConnectionScannedData.desktopConnectionId,
    validationPasswordEncrypted,
    validationPasswordSignature,
    encryptedData: dataToSendToDesktopStringEncrypted,
    encryptedDataSignature: dataToSendToDesktopStringSignature,
  });
}
