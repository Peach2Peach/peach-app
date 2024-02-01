export const mapEventToDrawerOption =
  (onPress: (eventID: MeetupEvent["id"]) => void) =>
  ({ longName, city, featured, id }: MeetupEvent) => ({
    title: longName,
    subtext: city,
    highlighted: featured,
    onPress: () => onPress(id),
  });
