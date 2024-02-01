import "react-native-url-polyfill/auto";

type BitcoinRequest = {
  address?: string;
  amount?: number;
  message?: string;
  time?: number;
  exp?: number;
};

export const parseBitcoinRequest = (request = "bitcoin:"): BitcoinRequest => {
  let urn: URL;
  const parsedRequest: BitcoinRequest = {};

  try {
    urn = new URL(request);
  } catch (e) {
    urn = new URL("bitcoin:");
  }
  const isLightning = /^ln/u.exec(request);
  const address =
    /^(?:bc1|tb1|bcrt1|BC1|TB1|BCRT1|[123])[a-zA-HJ-NP-Z0-9]{25,62}/u.exec(
      String(request.split(":").pop()),
    );

  if (address && !isLightning) {
    parsedRequest.address = address[0];
    if (/BC1|TB1|BCRT1/u.test(parsedRequest.address))
      parsedRequest.address = parsedRequest.address.toLocaleLowerCase();
  }
  if (urn.searchParams.get("amount"))
    parsedRequest.amount = Number(urn.searchParams.get("amount"));
  if (urn.searchParams.get("message"))
    parsedRequest.message = urn.searchParams.get("message") || "";
  if (urn.searchParams.get("time"))
    parsedRequest.time = Number(urn.searchParams.get("time"));
  if (urn.searchParams.get("exp"))
    parsedRequest.exp = Number(urn.searchParams.get("exp"));

  return parsedRequest;
};
