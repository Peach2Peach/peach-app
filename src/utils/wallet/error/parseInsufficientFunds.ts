type InsufficientFunds = {
  needed: string;
  available: string;
};

export const parseInsufficientFunds = (error: string): InsufficientFunds =>
  (error.match(
    /Insufficient funds: (?<available>\d+) sat available of (?<needed>\d+) sat needed/u,
  )?.groups as InsufficientFunds) || {
    needed: "unknown",
    available: "unknown",
  };
