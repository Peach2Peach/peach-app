import { getTradingPartner } from "./getTradingPartner";

describe("getTradingPartner", () => {
  it("returns seller if user is buyer", () => {
    const account: Partial<Account> = { publicKey: "03abc" };
    const seller: Partial<User> = { id: "02def" };
    const buyer: Partial<User> = { id: "03abc" };
    const contract: Partial<Contract> = {
      seller: seller as User,
      buyer: buyer as User,
    };
    expect(getTradingPartner(contract as Contract, account as Account)).toBe(
      seller,
    );
  });

  it("returns buyer if user is seller", () => {
    const account: Partial<Account> = { publicKey: "02def" };
    const seller: Partial<User> = { id: "02def" };
    const buyer: Partial<User> = { id: "03abc" };
    const contract: Partial<Contract> = {
      seller: seller as User,
      buyer: buyer as User,
    };
    expect(getTradingPartner(contract as Contract, account as Account)).toBe(
      buyer,
    );
  });
});
