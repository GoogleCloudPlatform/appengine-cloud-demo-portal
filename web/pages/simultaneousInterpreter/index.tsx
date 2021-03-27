import {
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
} from "@material-ui/core";
import Head from "next/head";

import DemoContainer from "../../components/DemoContainer";
import Recorder from "../../components/Recorder";
import { useTranslation } from "../../hooks/useTranslation";
import { demos } from "../../src/demos";
import { useError, useLanguages, useRecorder, useTranslations } from "./_hooks";
import Translations from "./_Translations";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panel: {
      padding: theme.spacing(4),
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
    <DemoContainer
      title={t.simultaneousInterpreter.title}
      description={t.simultaneousInterpreter.description}
      instructions={t.simultaneousInterpreter.instructions}
      productIds={demo.products}
      errorMessageProps={{
        open: error.open,
        onClose: onCloseError,
        message: error.message,
      }}
    >
      <Head>
        <title>
          {t.simultaneousInterpreter.title} | {t.title}
        </title>
      </Head>
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
    </DemoContainer>
  );
};

export default SimultaneousInterpreter;
