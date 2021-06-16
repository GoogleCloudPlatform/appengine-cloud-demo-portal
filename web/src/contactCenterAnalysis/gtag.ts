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
