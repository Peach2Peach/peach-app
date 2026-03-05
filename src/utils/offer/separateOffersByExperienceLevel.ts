export default function separateOffersByExperienceLevel<
  T extends { experienceLevelCriteria?: ExperienceLevel },
>({ offers, isNewUser }: { offers: T[]; isNewUser: boolean }): T[] {
  const moveToEnd = isNewUser ? "experiencedUsersOnly" : "newUsersOnly";

  const normal: T[] = [];
  const last: T[] = [];

  for (const offer of offers) {
    if (offer.experienceLevelCriteria === moveToEnd) {
      last.push(offer);
    } else {
      normal.push(offer);
    }
  }

  return [...normal, ...last];
}
