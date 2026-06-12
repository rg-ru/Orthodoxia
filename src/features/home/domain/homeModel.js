import { homeData } from "../data/homeData.js";

export function getHomeModel() {
  return {
    ...homeData,
    todayLabel: new Intl.DateTimeFormat("en", {
      weekday: "long",
      month: "long",
      day: "numeric"
    }).format(new Date())
  };
}
