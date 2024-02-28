type TargetBlocks =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15"
  | "16"
  | "17"
  | "18"
  | "19"
  | "20"
  | "21"
  | "22"
  | "23"
  | "24"
  | "25"
  | "144"
  | "504"
  | "1008";

type ConfirmationTargets = Record<TargetBlocks, number>;

type TransactionStatus = {
  confirmed: boolean;
  block_height?: number;
  block_hash?: string;
  block_time?: number;
};

type UTXO = {
  txid: string;
  vout: number;
  value: number;
  status: TransactionStatus;
};
