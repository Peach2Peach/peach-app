export const structureEventsByCountry = (
  obj: CountryEventsMap,
  event: MeetupEvent,
) => {
  if (event.country in obj) {
    obj[event.country] = [...obj[event.country], event];
  } else {
    obj[event.country] = [event];
  }
  return obj;
};
