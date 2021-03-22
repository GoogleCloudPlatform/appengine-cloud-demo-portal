import { useRouter } from "next/router";
import { useEffect } from "react";

import { enabledGa, pageview } from "../src/gtag";

const usePageView = (): void => {
  const router = useRouter();

  useEffect(() => {
    if (!enabledGa) {
      return;
    }

    const handleRouteChange = (url: string) => {
      pageview(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
};

export { usePageView };
