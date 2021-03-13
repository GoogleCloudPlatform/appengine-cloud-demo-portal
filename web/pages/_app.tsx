import {
  createStyles,
  CssBaseline,
  makeStyles,
  Theme,
  Toolbar,
} from "@material-ui/core";
import { AppProps } from "next/app";
import { useEffect } from "react";

import Header from "../components/Header";

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    container: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    },
  })
);

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const classes = useStyles();

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
      <Component {...pageProps} />
    </>
  );
};

export default App;
