import tw from "../../../styles/tailwind";

export const getPremiumColor = (premium: number, isBuyOffer: boolean) => {
  const colors = [
    tw`text-success-main`,
    tw`text-black-25`,
    tw`text-primary-main`,
  ];
  const colorIndex = premium < 0 ? 0 : premium === 0 ? 1 : 2;
  return isBuyOffer ? colors[colorIndex] : colors[Math.abs(colorIndex - 2)];
};
