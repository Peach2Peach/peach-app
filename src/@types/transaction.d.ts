type TransactionType =
  | "TRADE"
  | "ESCROWFUNDED"
  | "REFUND"
  | "WITHDRAWAL"
  | "DEPOSIT";

type OfferData = {
  offerId?: string;
  contractId?: string;
  address: string;
  amount: number;
  price?: number;
  currency?: Currency;
};
type Chain = "bitcoin" | "liquid" | "lightning";
type TransactionSummary = {
  id: string;
  type: TransactionType;
  chain: Chain;
  offerData: OfferData[];
  amount: number;
  date: Date;
  height?: number;
  confirmed: boolean;
};
