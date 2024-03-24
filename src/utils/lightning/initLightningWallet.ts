import {
  BreezEvent,
  EnvironmentType,
  NodeConfig,
  NodeConfigVariant,
  connect,
  defaultConfig,
  mnemonicToSeed,
  nodeInfo,
} from "@breeztech/react-native-breez-sdk";
import { Platform } from "react-native";
import RNFS from "react-native-fs";
import { error } from "../log/error";
import { log } from "../log/log";

const onBreezEvent = (e: BreezEvent) => {
  log(`breez-sdk - Received event ${e.type}`);
};

const readCertificate = async (path: string) => {
  const buffer = await (Platform.OS === "android"
    ? RNFS.readFileAssets(`certs/${path}`, "base64")
    : RNFS.readFile(
        `${RNFS.MainBundlePath}/assets/assets/certs/${path}`,
        "base64",
      ));

  const binaryBuffer = Buffer.from(buffer, "base64");
  const byteArray = Array.from(binaryBuffer);
  return byteArray;
};

export const initLightningWallet = async (mnemonic: string, apiKey: string) => {
  const [seed, deviceKey, deviceCert] = await Promise.all([
    mnemonicToSeed(mnemonic),
    readCertificate("client-key.pem"),
    readCertificate("client.crt"),
  ]);
  const nodeConfig: NodeConfig = {
    type: NodeConfigVariant.GREENLIGHT,
    config: {
      partnerCredentials: {
        deviceKey,
        deviceCert,
      },
    },
  };

  const config = await defaultConfig(
    EnvironmentType.PRODUCTION,
    apiKey,
    nodeConfig,
  );

  await connect(config, seed, onBreezEvent).catch((e) => {
    error(`breez-sdk - Error connecting: ${e}`);
  });
  nodeInfo();
};
