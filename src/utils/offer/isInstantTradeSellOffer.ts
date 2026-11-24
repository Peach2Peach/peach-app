/**
 * mirrors the server (peach-server isInstantTradeOffer): a sell offer is an
 * instant trade offer when the seller handed over encrypted payment data.
 * `instantTradeCriteria` is NOT what decides it.
 */
export const isInstantTradeSellOffer = ({
  paymentData,
}: {
  paymentData?: Partial<Record<string, { encrypted?: string } | undefined>>;
}) => Object.values(paymentData ?? {}).some((data) => !!data?.encrypted);
