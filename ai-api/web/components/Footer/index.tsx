import { createStyles, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    root: {
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    a: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    logo: {
      marginLeft: "0.5rem",
    },
  })
);

const Footer: React.FC = () => {
  const classes = useStyles();

  return (
    <footer className={classes.root}>
      <a
        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
        className={classes.a}
      >
        Powered by{" "}
        <img src="/vercel.svg" alt="Vercel Logo" className={classes.logo} />
      </a>
    </footer>
  );
};

export default Footer;
