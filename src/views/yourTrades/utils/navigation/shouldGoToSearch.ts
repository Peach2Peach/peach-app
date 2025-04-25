const statusThatLeadToSearch = [
  "searchingForPeer",
  "hasMatchesAvailable",
  "offerHidden",
  "offerHiddenWithMatchesAvailable",
];

export const shouldGoToSearch = (status: TradeStatus) =>
  statusThatLeadToSearch.includes(status);
