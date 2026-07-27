import "react-native-url-polyfill/auto";

type BitcoinRequest = {
  address?: string;
  amount?: number;
  message?: string;
  time?: number;
  exp?: number;
};

const BITCOIN_SCHEME = /^bitcoin:/iu;
const LIGHTNING = /^(?:lightning:)?ln/iu;
const UPPERCASE_BECH32 = /^(?:BC1|TB1|BCRT1)/u;
const ADDRESS = /^(?:bc1|tb1|bcrt1|[123])[a-zA-HJ-NP-Z0-9]{25,62}$/u;

/**
 * The address is the URI's path: everything between the scheme and the query.
 * Reading any other part of the URI would let a colon inside a parameter
 * (`?message=order:<other address>`) put a foreign address into the send field.
 */
const getAddress = (request: string) => {
  const path = request.replace(BITCOIN_SCHEME, "").split("?")[0].trim();
  // only bech32 is case insensitive, base58 addresses must be left untouched
  const address = UPPERCASE_BECH32.test(path) ? path.toLocaleLowerCase() : path;

  return ADDRESS.test(address) ? address : undefined;
};

export const parseBitcoinRequest = (request = "bitcoin:"): BitcoinRequest => {
  let urn: URL;
  const parsedRequest: BitcoinRequest = {};

  try {
    urn = new URL(request);
  } catch (e) {
    urn = new URL("bitcoin:");
  }

  const address = getAddress(request);
  if (address && !LIGHTNING.test(request)) parsedRequest.address = address;

  // uppercase QR codes carry uppercase parameter names as well
  const params = new Map<string, string>();
  urn.searchParams.forEach((value, key) =>
    params.set(key.toLocaleLowerCase(), value),
  );

  if (params.get("amount")) parsedRequest.amount = Number(params.get("amount"));
  if (params.get("message")) parsedRequest.message = params.get("message");
  if (params.get("time")) parsedRequest.time = Number(params.get("time"));
  if (params.get("exp")) parsedRequest.exp = Number(params.get("exp"));

  return parsedRequest;
};
