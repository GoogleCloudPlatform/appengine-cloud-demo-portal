/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
