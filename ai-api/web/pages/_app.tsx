import { CssBaseline } from "@material-ui/core";
import { AppProps } from "next/app";
import { useEffect } from "react";

import "../styles/globals.css";

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <CssBaseline />
      <Component {...pageProps} />
    </>
  );
};

export default App;
