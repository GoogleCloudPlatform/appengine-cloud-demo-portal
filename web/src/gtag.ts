export type ContactCenterAnalyticsEvent = {
  category: "contactCenterAnalytics";
  action: "start_recording" | "stop_recording";
  label: string;
  value?: number | null;
};

export type ServerlessWebAppWithDevOpsEvent = {
  category: "serverlessWebAppWithDevOps";
  action: "switch_tab";
  label: string;
  value?: null;
};

export type SimultaneousInterpreterEvent = {
  category: "simultaneousInterpreter";
  action: "start_recording" | "stop_recording";
  label: string;
  value?: number | null;
};

export type Event =
  | ContactCenterAnalyticsEvent
  | SimultaneousInterpreterEvent
  | ServerlessWebAppWithDevOpsEvent;

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

const enabledGa = GA_MEASUREMENT_ID !== "";

const pageview = (url: string): void => {
  if (!enabledGa) {
    return;
  }

  try {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  } catch (e) {
    console.error(e);
  }
};

const event = ({ category, action, label, value }: Event): void => {
  if (!enabledGa) {
    return;
  }

  try {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  } catch (e) {
    console.error(e);
  }
};

export { GA_MEASUREMENT_ID, enabledGa, pageview, event };
