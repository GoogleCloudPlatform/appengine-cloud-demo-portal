import en from "./en";

export type Locale = typeof en;

export interface Translations {
  [key: string]: string | Translations;
}
