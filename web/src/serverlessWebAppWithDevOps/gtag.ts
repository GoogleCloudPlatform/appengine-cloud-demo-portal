import { event, Event } from "../gtag";

interface ServerlessWebAppWithDevOpsEvent extends Event {
  category: "serverlessWebAppWithDevOps";
  action: "switch_tab";
  label: string;
}

const onChangeTabEvent = (tab: number): void =>
  event<ServerlessWebAppWithDevOpsEvent>({
    category: "serverlessWebAppWithDevOps",
    action: "switch_tab",
    label: tab.toString(),
  });

export { onChangeTabEvent };
