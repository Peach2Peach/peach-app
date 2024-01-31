import { Blockchain } from "bdk-rn";
import { BlockChainNames } from "bdk-rn/lib/lib/enums";
import { blockChainCreateMock } from "../../../../tests/unit/mocks/bdkRN";
import { checkNodeConnection } from "./checkNodeConnection";

const createBlockchainBlockHashMock =
  (validType?: BlockChainNames) => (config: unknown, type: string) => {
    const blockchain = new Blockchain();
    if (type === validType) {
      blockchain.getBlockHash = () => Promise.resolve("0000f...");
    } else {
      blockchain.getBlockHash = jest.fn().mockImplementation(() => {
        throw new Error("error");
      });
    }
    return blockchain;
  };
describe("checkNodeConnection", () => {
  it("should check electrum connection with success and return electrum node type", async () => {
    const settings = {
      sock5: null,
      retry: 1,
      timeout: 5,
      stopGap: 1,
      validateDomain: false,
    };
    blockChainCreateMock.mockImplementation(
      createBlockchainBlockHashMock(BlockChainNames.Electrum),
    );
    expect((await checkNodeConnection("electrum.node")).result).toBe(
      BlockChainNames.Electrum,
    );
    expect(blockChainCreateMock).toHaveBeenCalledWith(
      { url: "tcp://electrum.node", ...settings },
      BlockChainNames.Electrum,
    );
    await checkNodeConnection("electrum.node", true);
    expect(blockChainCreateMock).toHaveBeenCalledWith(
      { url: "ssl://electrum.node", ...settings },
      BlockChainNames.Electrum,
    );
  });
  it("should check esplora connection with success and return esplora node type", async () => {
    const settings = { proxy: null, concurrency: 1, timeout: 5, stopGap: 1 };
    blockChainCreateMock.mockImplementation(
      createBlockchainBlockHashMock(BlockChainNames.Esplora),
    );
    expect((await checkNodeConnection("esplora.node")).result).toBe(
      BlockChainNames.Esplora,
    );
    expect(blockChainCreateMock).toHaveBeenCalledWith(
      { baseUrl: "http://esplora.node", ...settings },
      BlockChainNames.Esplora,
    );
    await checkNodeConnection("esplora.node", true);
    expect(blockChainCreateMock).toHaveBeenCalledWith(
      { baseUrl: "https://esplora.node", ...settings },
      BlockChainNames.Esplora,
    );
  });
  it("should return all errors if no connection could be established", async () => {
    blockChainCreateMock.mockImplementation(createBlockchainBlockHashMock());
    expect((await checkNodeConnection("esplora.node")).error).toEqual(
      "error\n\nerror",
    );
  });
});
