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
  Response,
  getLanguages,
} from "../../src/api/contactCenterAnalysis";
import NaturalLanguageAnnotatedResult from "../../components/NaturalLanguageAnnotatedResult";
import { event } from "../../src/gtag";
import DemoContainer from "../../components/DemoContainer";

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

  const [responses, setResponses] = useState<Response[]>([]);
  const [error, setError] = useState({ open: false, msg: "" });
  const [languages, setLanguages] = useState<{
    languages: Language[];
    default: string;
  }>({ languages: [], default: "" });

  const onCloseError = () => setError({ open: false, msg: "" });

  const addResult = (response: Response) =>
    setResponses((responses) => [response, ...responses]);

  useEffect(() => {
    const f = async () => {
      try {
        const res = await getLanguages();
        setLanguages({
          languages: res.languages,
          default: res.languages[0].code,
        });
      } catch (e) {
        console.error(e);
        if (e instanceof Error) {
          setError({ open: true, msg: e.message });
        } else {
          setError({ open: true, msg: "something went wrong." });
        }
      }
    };
    void f();
  }, []);

  const onStart = (lang: string) => {
    event({
      category: "contactCenterAnalytics",
      action: "start_recording",
      label: lang,
    });
  };

  const onStop = async (
    lang: string,
    duration: number | null,
    blob: Blob
  ): Promise<void> => {
    event({
      category: "contactCenterAnalytics",
      action: "stop_recording",
      label: lang,
      value: duration,
    });
    try {
      const res = await analyze(lang, blob);
      addResult(res);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        setError({ open: true, msg: e.message });
      } else {
        setError({ open: true, msg: "something went wrong." });
      }
    }
  };

  return (
    <DemoContainer
      title={t.contactCenterAnalysis.title}
      description={t.contactCenterAnalysis.description}
      instructions={[]}
      productIds={demo.products}
      errorMessageProps={{
        open: error.open,
        onClose: onCloseError,
        message: error.msg,
      }}
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
