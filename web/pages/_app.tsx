import DateFnsUtils from "@date-io/date-fns";
import { CssBaseline, Toolbar } from "@material-ui/core";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { AppProps } from "next/app";
import { useEffect } from "react";

import Header from "../components/Header";
import { usePageView } from "../hooks/usePageView";

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  usePageView();

  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <CssBaseline />
      <Header />
      <Toolbar />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Component {...pageProps} />
      </MuiPickersUtilsProvider>
    </>
  );
};

export default App;
