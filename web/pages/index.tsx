import Head from "next/head";
import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";

import { useTranslation } from "../hooks/useTranslation";
import { demoIds } from "../src/demos";
import DemoCard from "../components/DemoCard";

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

const Index: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <main className={classes.root}>
      <Head>
        <title>{t.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Grid
        container
        spacing={3}
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
      >
        {demoIds.map((demoId) => (
          <Grid item key={demoId} md={6} sm={12} xs={12}>
            <DemoCard demoId={demoId} />
          </Grid>
        ))}
      </Grid>
    </main>
  );
};

export default Index;
