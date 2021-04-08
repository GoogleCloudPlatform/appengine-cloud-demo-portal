import { event, Event } from "../gtag";

interface WikipediaPageviewEvent extends Event {
  category: "wikipediaPageview";
  action: "run_query";
  label: "";
}

const runQueryEvent = (): void =>
  event<WikipediaPageviewEvent>({
    category: "wikipediaPageview",
    action: "run_query",
    label: "",
  });

export { runQueryEvent };
