import Clipboard from "@react-native-clipboard/clipboard";
import { fireEvent, render } from "test-utils";
import { contract } from "../../../../peach-api/src/testData/contract";
import { validSEPAData } from "../../../../tests/unit/data/paymentData";
import { Icon } from "../../../components/Icon";
import { usePaymentDataStore } from "../../../store/usePaymentDataStore";
import {
  isTradeInformationGetter,
  tradeInformationGetters,
} from "./tradeInformationGetters";

jest.mock("../../../utils/offer/getWalletLabel", () => ({
  getWalletLabel: jest.fn(() => "walletLabel"),
}));

jest.mock("../../../utils/contract/getBuyOfferFromContract", () => ({
  getBuyOfferFromContract: jest.fn(() => ({
    walletLabel: "buyOfferWalletLabel",
    releaseAddress: "releaseAddress",
  })),
}));

jest.mock("../context", () => ({
  useContractContext: jest.fn(() => ({
    paymentData: "paymentData",
  })),
}));

describe("tradeInformationGetters", () => {
  it("should return the correct value for the price field", () => {
    expect(tradeInformationGetters.price(contract)).toEqual("89.04 EUR");
    expect(
      tradeInformationGetters.price({
        ...contract,
        price: 12345,
        currency: "SAT",
      }),
    ).toEqual("12 345 SAT");
  });
  it("should apply the priceFormat function to the price field", () => {
    expect(
      tradeInformationGetters.price({ ...contract, price: 21000000 }),
    ).toEqual("21 000 000.00 EUR");
  });
  it('should only copy the amount and not the currency for "you should pay" field', () => {
    const element = tradeInformationGetters.youShouldPay({
      ...contract,
      price: 89.04,
      currency: "EUR",
    });
    const { UNSAFE_getByType } = render(element);
    fireEvent.press(UNSAFE_getByType(Icon));
    expect(Clipboard.setString).toHaveBeenCalledWith("89.04");
  });
  it("should return the correct value for the paidToMethod field", () => {
    usePaymentDataStore.getState().addPaymentData(validSEPAData);
    const element = tradeInformationGetters.paidToMethod(
      contract,
    ) as JSX.Element;
    expect(render(element).toJSON()).toMatchSnapshot();
  });
  it("should return the correct value for the paidWithMethod field", () => {
    expect(tradeInformationGetters.paidWithMethod(contract)).toEqual("SEPA");
  });
  it("should return the correct value for the bitcoinAmount field", () => {
    expect(tradeInformationGetters.bitcoinAmount(contract)).toEqual(
      contract.amount,
    );
  });
  it("should return the correct value for the bitcoinPrice field", () => {
    expect(tradeInformationGetters.bitcoinPrice(contract)).toEqual(
      "35 616.00 EUR",
    );
    expect(
      tradeInformationGetters.bitcoinPrice({
        ...contract,
        currency: "SAT",
        amount: 40000,
        price: 40600,
      }),
    ).toEqual("101 500 000 SAT");
  });
  it("should return the correct value for the via field", () => {
    const element = tradeInformationGetters.via({ ...contract }) as JSX.Element;
    expect(render(element).toJSON()).toMatchSnapshot();
  });
  it("should return the correct value for the method field", () => {
    expect(tradeInformationGetters.method(contract)).toEqual("SEPA");
  });
});

describe("isTradeInformationGetter", () => {
  it("should return true if the field name is a valid trade information getter", () => {
    expect(isTradeInformationGetter("price")).toEqual(true);
  });
  it("should return false if the field name is not a valid trade information getter", () => {
    expect(isTradeInformationGetter("name")).toEqual(false);
  });
});
