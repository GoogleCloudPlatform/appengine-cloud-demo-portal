import { createStyles, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(5),
      paddingBottom: theme.spacing(5),
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(5),
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
  })
);

const ContactCenterAnalysis: React.FC = () => {
  const classes = useStyles();

  return (
    <main className={classes.root}>
      <h1>Contact Center Analysis</h1>
    </main>
  );
};

export default ContactCenterAnalysis;
