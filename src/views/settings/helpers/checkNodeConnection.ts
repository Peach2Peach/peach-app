import { ElectrumClient, EsploraClient } from "bdk-rn";
import { info } from "../../../utils/log/info";
import { parseError } from "../../../utils/parseError";
import { BlockChainNames } from "../../../utils/wallet/BlockChainNames";
import { addProtocol } from "../../../utils/web/addProtocol";
const checkElectrumConnection = async (address: string, ssl: boolean) => {
  try {
    info("Checking electrum connection...");

    const blockchain = new ElectrumClient(
      addProtocol(address, ssl ? "ssl" : "tcp"),
    );
    blockchain.estimateFee(BigInt(1)); //TODO: test if .ping() also raises
    return { result: BlockChainNames.Electrum };
  } catch (e) {
    info("electrum connection failed");
    return { error: parseError(e) };
  }
};
const checkEsploraConnection = async (address: string, ssl: boolean) => {
  try {
    info("Checking esplora connection...");

    const blockchain = new EsploraClient(
      addProtocol(address, ssl ? "https" : "http"),
    );
    const currentHeight = blockchain.getHeight();
    blockchain.getBlockHash(currentHeight);

    return { result: BlockChainNames.Esplora };
  } catch (e) {
    info("esplora connection failed");
    return { error: parseError(e) };
  }
};
const connectionChecks = [checkElectrumConnection, checkEsploraConnection];
export const checkNodeConnection = async (address: string, ssl = false) => {
  const errors: unknown[] = [];
  for (const connectionCheck of connectionChecks) {
    // eslint-disable-next-line no-await-in-loop
    const { result, error } = await connectionCheck(address, ssl);
    if (result) return { result };
    errors.push(error);
  }
  return { error: errors.join("\n\n") };
};
