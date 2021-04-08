import {
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Paper,
} from "@material-ui/core";
import { useState, useEffect } from "react";
import Head from "next/head";

import { useTranslation } from "../../hooks/useTranslation";
import { demos } from "../../src/demos";
import Recorder, { Language } from "../../components/Recorder";
import {
  analyze,
  AnalyzeResponse,
  getLanguages,
} from "../../src/api/contactCenterAnalysis";
import NaturalLanguageAnnotatedResult from "../../components/NaturalLanguageAnnotatedResult";
import DemoContainer from "../../components/DemoContainer";
import { useError } from "../../hooks/useError";
import {
  onStartEvent,
  onStopEvent,
} from "../../src/contactCenterAnalysis/gtag";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    panel: {
      padding: theme.spacing(4),
    },
  })
);

const demo = demos["contactCenterAnalysis"];

const ContactCenterAnalysis: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { errorMessage, setErrorMessage, onCloseError } = useError();

  const [responses, setResponses] = useState<AnalyzeResponse[]>([]);
  const [languages, setLanguages] = useState<{
    languages: Language[];
    default: string;
  }>({ languages: [], default: "" });

  const addResult = (response: AnalyzeResponse) =>
    setResponses((responses) => [response, ...responses]);

  useEffect(() => {
    const f = async () => {
      const res = await getLanguages();
      if (res.success) {
        setLanguages({
          languages: res.data.languages,
          default: res.data.languages[0].code,
        });
      } else {
        setErrorMessage(`failed to get languages: ${res.error.message}`);
      }
    };
    void f();
  }, [setErrorMessage]);

  const onStart = (lang: string) => onStartEvent(lang);

  const onStop = async (
    lang: string,
    duration: number | null,
    blob: Blob
  ): Promise<void> => {
    onStopEvent(lang, duration);

    const res = await analyze(lang, blob);
    if (res.success) {
      addResult(res.data);
    } else {
      setErrorMessage(`failed to analyze speech: ${res.error.message}`);
    }
  };

  return (
    <DemoContainer
      title={t.contactCenterAnalysis.title}
      description={t.contactCenterAnalysis.description}
      instructions={t.contactCenterAnalysis.instructions}
      productIds={demo.products}
      errorMessage={errorMessage}
      onCloseError={onCloseError}
    >
      <Head>
        <title>
          {t.contactCenterAnalysis.title} | {t.title}
        </title>
      </Head>
      <Grid item>
        <Paper className={classes.panel}>
          <Recorder
            onStart={onStart}
            onStop={onStop}
            languages={languages.languages}
            defaultLanguage={languages.default}
          />
        </Paper>
      </Grid>
      <Grid item>
        <Paper className={classes.panel}>
          <Grid container direction="column" spacing={2}>
            {responses.map((res, i) => (
              <Grid item xs={12} key={i}>
                <NaturalLanguageAnnotatedResult result={res} />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>
    </DemoContainer>
  );
};

export default ContactCenterAnalysis;
