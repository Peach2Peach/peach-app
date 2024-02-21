import { SwapTree } from "boltz-core/dist/lib/consts/Types";

export type Contracts = {
  /** Information about the network */
  network?: {
    /** ID of the chain */
    chainId: number;
    /** Name of the chain if applicable */
    name?: string;
  };
  /** Mapping of the names of swap contracts to their address */
  swapContracts: {
    /** Address of the EtherSwap contract */
    EtherSwap: string;
    /** Address of the ERC20 contract */
    ERC20Swap: string;
  };
  /** Mapping of the symbol of tokens to their address */
  tokens: Record<string, string>;
}

export type NodeInfo = {
  publicKey: string;
  uris: string[];
}

export type NodeStats = {
  capacity: number;
  channels: number;
  peers: number;
  /** UNIX timestamp of the block in which the funding transaction of the oldest channel was included */
  oldestChannel: number;
}

export type ErrorResponse = {
  /** Description of the error that caused the request to fail */
  error: string;
}

export type SwapTreeLeaf = {
  /** Tapscript version */
  version: number;
  /** Script encoded as HEX */
  output: string;
}

export type SubmarinePair = {
  /** Hash of the pair that can be used when creating the Submarine Swap to ensure the information of the client is up-to-date */
  hash: string;
  /** Exchange rate of the pair */
  rate: number;
  limits?: {
    /** Minimal amount that can be swapped in satoshis */
    minimal: number;
    /** Maximal amount that can be swapped in satoshis */
    maximal: number;
    /** Maximal amount that will be accepted 0-conf in satoshis */
    maximalZeroConf: number;
  };
  fees: {
    /** Relative fee that will be charged in percent */
    percentage: number;
    /** Absolute miner fee that will be charged in satoshis */
    minerFees: number;
  };
}
export type SubmarineList = Record<string, Record<string, SubmarinePair>>

export type SubmarineRequest = {
  /** The asset that is sent onchain */
  from: string;
  /** The asset that is received on lightning */
  to: string;
  /** BOLT11 invoice that should be paid */
  invoice?: string;
  /** Preimage hash of an invoice that will be set later */
  preimageHash?: string;
  /** Public key with which the Submarine Swap can be refunded encoded as HEX */
  refundPublicKey: string;
  /** Pair hash from the pair information for the client to check if their fee data is up-to-date */
  pairHash?: string;
  /** Referral ID to be used for the Submarine swap */
  referralId?: string;
}

export type SubmarineResponse = {
  /** ID of the created Submarine Swap */
  id: string;
  /** BIP21 for the onchain payment request */
  bip21?: string;
  /** Onchain HTLC address */
  address?: string;
  swapTree?: SwapTree;
  /** Public key of Boltz that will be used to sweep the onchain HTLC */
  claimPublicKey?: string;
  /** Timeout block height of the onchain HTLC */
  timeoutBlockHeight: number;
  /** Whether 0-conf will be accepted assuming the transaction does not signal RBF and has a reasonably high fee */
  acceptZeroConf?: boolean;
  /** Amount that is expected to be sent to the onchain HTLC address in satoshis */
  expectedAmount: number;
  /** Liquid blinding private key encoded as HEX */
  blindingKey?: string;
}

export type SubmarineTransaction = {
  /** ID the lockup transaction */
  id: string;
  /** Lockup transaction as raw HEX */
  hex?: string;
  /** Block height at which the time-lock expires */
  timeoutBlockHeight: number;
  /** UNIX timestamp at which the time-lock expires; set if it has not expired already */
  timeoutEta?: number;
}

export type SubmarineRefundRequest = {
  /** Public nonce of the client for the session encoded as HEX */
  pubNonce: string;
  /** Transaction which should be signed encoded as HEX */
  transaction: string;
  /** Index of the input of the transaction that should be signed */
  index: number;
}

export type PartialSignature = {
  /** Public nonce  encoded as HEX */
  pubNonce: string;
  /** Partial signature encoded as HEX */
  partialSignature: string;
}

export type SubmarineClaimDetails = {
  /** Preimage of the invoice for the Submarine Swap encoded as HEX */
  preimage: string;
  /** Public nonce of Boltz encoded as HEX */
  pubNonce: string;
  /** Public key of Boltz encoded as HEX */
  publicKey: string;
  /** Hash of the transaction that should be signed */
  transactionHash: string;
}

export type ReversePair = {
  /** Hash of the pair that can be used when creating the Reverse Swap to ensure the information of the client is up-to-date */
  hash: string;
  /** Exchange rate of the pair */
  rate: number;
  limits?: {
    /** Minimal amount that can be swapped in satoshis */
    minimal: number;
    /** Maximal amount that can be swapped in satoshis */
    maximal: number;
  };
  fees?: {
    /** Relative fee that will be charged in percent */
    percentage: number;
    minerFees?: {
      /** Absolute miner fee that will be charged in satoshis */
      lockup: number;
      /** Absolute miner fee that we estimate for the claim transaction in satoshis */
      claim: number;
    };
  };
}

export type ReverseList = Record<string, Record<string, ReversePair>>

export type ReverseRequest = {
  /** The asset that is sent on lightning */
  from: string;
  /** The asset that is received onchain */
  to: string;
  /** SHA-256 hash of the preimage of the Reverse Swap encoded as HEX */
  preimageHash: string;
  /** Public key with which the Reverse Swap can be claimed encoded as HEX */
  claimPublicKey?: string;
  /** EVM address with which the Reverse Swap can be claimed */
  claimAddress?: string;
  /** Amount for which the invoice should be; conflicts with "onchainAmount" */
  invoiceAmount?: number;
  /** Amount that should be locked in the onchain HTLC; conflicts with "invoiceAmount" */
  onchainAmount?: number;
  /** Pair hash from the pair information for the client to check if their fee data is up-to-date */
  pairHash?: string;
  /** Referral ID to be used for the Submarine swap */
  referralId?: string;
  /** Address to be used for a BIP-21 direct payment */
  address?: string;
  /** Signature of the claim public key of the SHA256 hash of the address for the direct payment */
  addressSignature?: string;
}

export type ReverseResponse = {
  /** ID of the created Reverse Swap */
  id: string;
  /** Hold invoice of the Reverse Swap */
  invoice: string;
  swapTree?: SwapTree;
  /** HTLC address in which coins will be locked */
  lockupAddress?: string;
  /** Public key of Boltz that will be used to refund the onchain HTLC */
  refundPublicKey?: string;
  /** Timeout block height of the onchain HTLC */
  timeoutBlockHeight: number;
  /** Amount that will be locked in the onchain HTLC */
  onchainAmount?: number;
  /** Liquid blinding private key encoded as HEX */
  blindingKey?: string;
}

export type ReverseTransaction = {
  /** ID the lockup transaction */
  id: string;
  /** Lockup transaction as raw HEX */
  hex?: string;
  /** Block height at which the time-lock expires */
  timeoutBlockHeight: number;
}

export type ReverseClaimRequest = {
  /** Preimage of the Reverse Swap encoded as HEX */
  preimage: string;
  /** Public nonce of the client for the session encoded as HEX */
  pubNonce: string;
  /** Transaction which should be signed encoded as HEX */
  transaction: string;
  /** Index of the input of the transaction that should be signed */
  index: number;
}

export type ReverseBip21 = {
  /** BIP-21 for the Reverse Swap */
  bip21: string;
  /** Signature of the address in the BIP-21 of the public key in the routing hint */
  signature: string;
}

export type SwapStatus = {
  /** Status of the Swap */
  status: string;
  /** Whether 0-conf was accepted for the lockup transaction of the Submarine Swap */
  zeroConfRejected?: boolean;
  /** Details of the lockup transaction of a Reverse Swap */
  transaction?: {
    /** ID of the transaction */
    id?: string;
    /** Raw hex of the transaction */
    hex?: string;
  };
}
