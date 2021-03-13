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
import Footer from "../components/Footer";

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    container: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    },
    main: {
      flex: 1,
    },
    footer: {
      width: "100%",
      height: "100px",
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
      <div className={classes.container}>
        <div className={classes.main}>
          <Toolbar />
          <Component {...pageProps} />
        </div>
        <div className={classes.footer}>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default App;
