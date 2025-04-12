import { TradeStatus } from "../../../../../peach-api/src/@types/offer";

const statusThatLeadToSearch = [
  "searchingForPeer",
  "hasMatchesAvailable",
  "hasTradeRequests",
  "offerHidden",
  "offerHiddenWithMatchesAvailable",
];

export const shouldGoToSearch = (status: TradeStatus) =>
  statusThatLeadToSearch.includes(status);
