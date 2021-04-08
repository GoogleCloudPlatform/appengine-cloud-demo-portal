import { event, Event } from "../gtag";

interface SimultaneousInterpreterEvent extends Event {
  category: "simultaneousInterpreter";
  action: "start_recording" | "stop_recording";
  label: string;
  value?: number | null;
}

const onStartEvent = (lang: string): void =>
  event<SimultaneousInterpreterEvent>({
    category: "simultaneousInterpreter",
    action: "start_recording",
    label: lang,
  });

const onStopEvent = (lang: string, duration: number | null): void =>
  event<SimultaneousInterpreterEvent>({
    category: "simultaneousInterpreter",
    action: "stop_recording",
    label: lang,
    value: duration,
  });

export { onStartEvent, onStopEvent };
