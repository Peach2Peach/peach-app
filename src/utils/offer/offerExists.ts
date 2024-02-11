import { getOffer } from "./getOffer";

export const offerExists = (id: string) => getOffer(id) !== undefined;
