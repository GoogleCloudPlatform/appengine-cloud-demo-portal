export interface Event {
  category: string;
  action: string;
  label: string;
  value?: number | null;
}

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

const event = <T extends Event>({
  category,
  action,
  label,
  value,
}: T): void => {
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
