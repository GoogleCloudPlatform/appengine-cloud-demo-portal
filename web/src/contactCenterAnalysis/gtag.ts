import { event, Event } from "../gtag";

interface ContactCenterAnalysisEvent extends Event {
  category: "contactCenterAnalysis";
  action: "start_recording" | "stop_recording";
  label: string;
  value?: number | null;
}

const onStartEvent = (lang: string): void =>
  event<ContactCenterAnalysisEvent>({
    category: "contactCenterAnalysis",
    action: "start_recording",
    label: lang,
  });

const onStopEvent = (lang: string, duration: number | null): void =>
  event<ContactCenterAnalysisEvent>({
    category: "contactCenterAnalysis",
    action: "stop_recording",
    label: lang,
    value: duration,
  });

export { onStartEvent, onStopEvent };
