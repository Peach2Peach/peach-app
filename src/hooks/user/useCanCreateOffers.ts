import { NETWORK } from "@env";
import { CREATE_OFFER_TRADE_THRESHOLD } from "../../constants";
import { useSelfUser } from "../query/useSelfUser";

export const useCanCreateOffers = () => {
  const { user } = useSelfUser();
  return (
    NETWORK === "regtest" || // for testing, comment out to test the other criteria
    !!user?.kyc ||
    !!user?.whitelisted ||
    (user?.trades ?? 0) >= CREATE_OFFER_TRADE_THRESHOLD
  );
};
