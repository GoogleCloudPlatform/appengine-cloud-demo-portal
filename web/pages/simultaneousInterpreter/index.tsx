import {
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from "@material-ui/core";
import Head from "next/head";

import ErrorMessage from "../../components/ErrorMessage";
import HelpButton from "../../components/HelpButton";
import ProductChips from "../../components/ProductChips";
import Recorder from "../../components/Recorder";
import { useTranslation } from "../../hooks/useTranslation";
import { demos } from "../../src/demos";
import { useError, useLanguages, useRecorder, useTranslations } from "./_hooks";
import Translations from "./_Translations";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(4),
      paddingLeft: theme.spacing(8),
      paddingRight: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      maxWidth: 1200,
    },
    panel: {
      padding: theme.spacing(4),
    },
    titleContainer: {
      paddingBottom: theme.spacing(4),
    },
    helpButtonContainer: {
      textAlign: "right",
    },
    description: {
      paddingBottom: theme.spacing(4),
    },
    translations: {
      padding: theme.spacing(4),
      height: "60vh",
    },
  })
);

const demo = demos["simultaneousInterpreter"];

const SimultaneousInterpreter: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { error, setError, onCloseError } = useError();
  const { translations, addTranslations } = useTranslations();
  const { onStart, onStop } = useRecorder(addTranslations, setError);
  const { languages, defaultLanguage } = useLanguages(setError);

  return (
    <main className={classes.root}>
      <Head>
        <title>
          {t.simultaneousInterpreter.title} | {t.title}
        </title>
      </Head>
      <Grid
        container
        direction="column"
        spacing={2}
        className={classes.container}
      >
        <Grid item>
          <Paper className={classes.panel}>
            <Grid
              container
              direction="row"
              alignItems="center"
              className={classes.titleContainer}
            >
              <Grid item xs={11}>
                <Typography variant="h3" component="h2">
                  {t.simultaneousInterpreter.title}
                </Typography>
              </Grid>
              <Grid item xs={1} className={classes.helpButtonContainer}>
                <HelpButton
                  instructions={t.simultaneousInterpreter.instructions}
                />
              </Grid>
            </Grid>
            <Typography
              variant="subtitle1"
              component="p"
              className={classes.description}
            >
              {t.simultaneousInterpreter.description}
            </Typography>
            <ProductChips productIds={demo.products} />
          </Paper>
        </Grid>
        <Grid item>
          <Paper className={classes.panel}>
            <Recorder
              onStart={onStart}
              onStop={onStop}
              languages={languages}
              defaultLanguage={defaultLanguage}
            />
          </Paper>
        </Grid>
        <Grid item>
          <Paper className={classes.translations}>
            <Translations translations={translations} />
          </Paper>
        </Grid>
      </Grid>
      <ErrorMessage
        open={error.open}
        onClose={onCloseError}
        message={error.message}
      />
    </main>
  );
};

export default SimultaneousInterpreter;
