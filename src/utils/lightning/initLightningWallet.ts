import {
  BreezEvent,
  EnvironmentType,
  NodeConfig,
  NodeConfigVariant,
  connect,
  defaultConfig,
  mnemonicToSeed,
} from "@breeztech/react-native-breez-sdk";
import { log } from "../log/log";

const onBreezEvent = (e: BreezEvent) => {
  log(`breez-sdk - Received event ${e.type}`);
};

export const initLightningWallet = async (
  mnemonic: string,
  apiKey: string,
  inviteCode: string,
) => {
  const seed = await mnemonicToSeed(mnemonic);
  const nodeConfig: NodeConfig = {
    type: NodeConfigVariant.GREENLIGHT,
    config: { inviteCode },
  };

  const config = await defaultConfig(
    EnvironmentType.PRODUCTION,
    apiKey,
    nodeConfig,
  );

  await connect(config, seed, onBreezEvent);
};
