export const getBuyOfferIdFromContract = ({ id }: { id: string }) =>
  id.split("-")[1];
